import { db } from "@/database";
import { profiles} from "@/database/schema";
import * as schema from "@/database/schema";
import { expo } from "@better-auth/expo";
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { onboardingValuesSchema } from "./validations/onboarding-validation";

const AUTH_URL = process.env.BETTER_AUTH_URL!;

const getOnboarding = (body: unknown) => {
    const result = onboardingValuesSchema.safeParse(body);

    if (!result.success) {
        throw new APIError("BAD_REQUEST", {
            message: "Invalid onboarding details",
        });
    }

    return result.data;
};

export const auth = betterAuth({
    appName: "MyWorkout",
    baseURL: AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET!,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    trustedOrigins: [
        "aiworkouttracker://",
        "aiworkouttracker://*",

        "exp://",
        "exp://*",
        "exp://**",
        "exp://192.168.*.*:*/**",
        "exp://10.5.*.*:*/**",

        "http://localhost:*",
        "http://192.168.*.*:*",
        "http://10.5.*.*:*",

        AUTH_URL,
    ].filter(Boolean),

    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                getOnboarding(ctx.body);
            }
        }),

        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path !== "/sign-up/email" || !ctx.context.newSession) {
                return;
            }

            await db.insert(profiles).values({
                userId: ctx.context.newSession.user.id,
                ...getOnboarding(ctx.body),
            });
        }),
    },

    plugins: [expo()],
});

export type AuthSession = typeof auth.$Infer.Session;