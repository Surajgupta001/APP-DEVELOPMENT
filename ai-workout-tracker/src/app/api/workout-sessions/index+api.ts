import { db, workoutExercises, workouts, workoutSessions, workoutSessionSets } from "@/database";
import { auth } from "@/lib/auth";
import { and, count, countDistinct, desc, eq } from "drizzle-orm";
import { z } from "zod";

const setSchema = z.object({
    exerciseId: z.uuid(),
    setNumber: z.number().int().min(1).max(20),
    reps: z.number().int().min(0).max(500),
    weight: z.number().min(0).max(1000).optional(),
});

const sessionSchema = z.object({
    workoutId: z.uuid(),
    startedAt: z.iso.datetime(),
    completedAt: z.iso.datetime(),
    durationSeconds: z.number().int().min(0),
    sets: z.array(setSchema).max(100),
});

export async function GET(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session) {
        return new Response("Unauthorized", {
            status: 401,
        });
    }

    const url = new URL(request.url);
    const limitVal = url.searchParams.get("limit");

    // Honor the optional limit the client sends (e.g. ?limit=1 for recent
    // workout) while keeping the unpaginated history view unchanged.
    const limit = limitVal
        ? z.coerce.number().int().min(1).max(50).safeParse(limitVal)
        : null;

    if (limit && !limit.success) {
        return Response.json({ message: "Invalid limit" }, { status: 400 });
    }

    const data = db
        .select({
            id: workoutSessions.id,
            workoutId: workoutSessions.workoutId,
            completedAt: workoutSessions.completedAt,
            durationSeconds: workoutSessions.durationSeconds,
            exerciseCount: countDistinct(workoutSessionSets.exerciseId),
            setCount: count(workoutSessionSets.id),
            workoutname: workouts.name,
            image: workouts.image,
        }).from(workoutSessions)
        .innerJoin(workouts, eq(workouts.id, workoutSessions.workoutId))
        .leftJoin(workoutSessionSets, eq(workoutSessionSets.sessionId, workoutSessions.id))
        .where(eq(workoutSessions.userId, session.user.id))
        .groupBy(workoutSessions.id, workouts.id)
        .orderBy(desc(workoutSessions.completedAt))
        .$dynamic();

    const result = limit?.success ? await data.limit(limit.data) : await data;

    return Response.json(result, {
        status: 200,
    });
};

export async function POST(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session) {
        return new Response("Unauthorized", {
            status: 401,
        });
    }

    const body = await request.json();
    const result = sessionSchema.safeParse(body);

    if (!result.success) {
        return new Response("Invalid request body", {
            status: 400,
        });
    }

    const { completedAt, durationSeconds, sets, startedAt, workoutId } = result.data;

    const sessionId = crypto.randomUUID();

    const createdSession = await db.transaction(async (tx) => {

        // 1. Verify that the workout belongs to the current user
        const [workout] = await tx
            .select({
                id: workouts.id,
            })
            .from(workouts)
            .where(
                and(
                    eq(workouts.id, workoutId),
                    eq(workouts.userId, session.user.id),
                ),
            )
            .limit(1);

        if (!workout) {
            throw new Error("WORKOUT_NOT_FOUND");
        }

        // 2. Get all exercises that belong to this workout
        const workoutExerciseRows = await tx
            .select({
                exerciseId: workoutExercises.exerciseId,
            })
            .from(workoutExercises)
            .where(eq(workoutExercises.workoutId, workoutId));

        const exerciseIds = new Set(
            workoutExerciseRows.map(({ exerciseId }) => exerciseId),
        );

        // 3. Only accept sets for exercises in this workout
        const validSets = sets.filter(({ exerciseId }) =>
            exerciseIds.has(exerciseId),
        );

        // 4. Create workout session
        await tx.insert(workoutSessions).values({
            id: sessionId,
            userId: session.user.id,
            workoutId,
            startedAt: new Date(startedAt),
            completedAt: new Date(completedAt),
            durationSeconds,
        });

        // 5. Save completed sets
        if (validSets.length > 0) {
            await tx.insert(workoutSessionSets).values(
                validSets.map((set) => ({
                    id: crypto.randomUUID(),
                    sessionId,
                    exerciseId: set.exerciseId,
                    setNumber: set.setNumber,
                    reps: set.reps,
                    weight: set.weight ?? null,
                })),
            );
        }

        return sessionId;
    });

    return Response.json({
        message: "Workout session created successfully",
        id: createdSession,
    }, {
        status: 201,
    });
};