import { db, exercises } from "@/database";
import { TTLCache } from "@/lib/cache";
import { auth } from "@/lib/auth";
import { getClientKey, rateLimit } from "@/lib/rate-limit";
import { groq } from "@ai-sdk/groq";
import { generateText, Output } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.uuid();

const instructionOutputSchema = z.object({
    instructions: z
        .array(z.string())
        .min(1)
        .describe("step-by-step instructions on how to perform the exercise safely and with proper form"),
});

// Instructions are deterministic per exercise, so cache them for 24 hours.
const instructionsCache = new TTLCache<string[]>(24 * 60 * 60 * 1000);

// Per-user AI budget: 10 generations per 5 minutes.
const AI_RATE_LIMIT = 10;
const AI_RATE_WINDOW_MS = 5 * 60 * 1000;

export async function GET(request: Request, { id }: Record<string, string>) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session) {
        return Response.json({
            message: "Unauthorized",
        }, {
            status: 401,
        });
    }

    if (!idSchema.safeParse(id).success) {
        return Response.json({
            message: "Invalid exercise ID",
        }, {
            status: 400,
        });
    }

    const [exercise] = await db
        .select({
            category: exercises.category,
            description: exercises.description,
            muscles: exercises.muscles,
            name: exercises.name,
        })
        .from(exercises)
        .where(eq(exercises.id, id))
        .limit(1);

    if (!exercise) {
        return Response.json({
            message: "Exercise not found",
        }, {
            status: 404,
        });
    }

    const cached = instructionsCache.get(id);

    if (cached) {
        return Response.json({
            instructions: cached,
        });
    }

    const limit = rateLimit(getClientKey(request, session.user.id), {
        limit: AI_RATE_LIMIT,
        windowMs: AI_RATE_WINDOW_MS,
    });

    if (!limit.success) {
        return Response.json({
            message: "Too many AI requests. Please try again later.",
        }, {
            status: 429,
            headers: {
                "Retry-After": String(limit.retryAfterSeconds),
            },
        });
    }

    try {
        const { output } = await generateText({
            model: groq("openai/gpt-oss-20b"),
            output: Output.object({
                schema: instructionOutputSchema,
            }),
            system:
                "You are an expert AI fitness coach. Generate 4 to 5 concise, actionable step-by-step instructions for performing the given exercise safely and with proper form.",
            prompt: `Exercise: ${exercise.name} Category: ${exercise.category} Target Muscles: ${exercise.muscles} Description: ${exercise.description}`,
        });

        if (output?.instructions && output.instructions.length > 0) {
            instructionsCache.set(id, output.instructions);

            return Response.json({
                instructions: output.instructions,
            });
        }

        return Response.json({
            message: "Failed to generate exercise instructions",
        }, {
            status: 500,
        });

    } catch (error) {
        console.error("AI Generation failed:", error);

        return Response.json({
            message: "Failed to generate exercise instructions",
        }, {
            status: 500,
        });
    }
}