import { APIError, betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@/database/schema';
import { db } from '@/database'
import { onboardingValuesSchema } from "./validations/onboarding-validation";
import { createAuthMiddleware } from "better-auth/api";
import { profiles } from "@/database/schema";

const AUTH_URL = process.env.BETTER_AUTH_URL!;

const getOnboarding = (body: unknown) => {
    const result = onboardingValuesSchema.safeParse(body);
    if (!result.success) {
        throw new APIError('BAD_REQUEST', {
            message: 'Invalid onboarding values',
        });
    }
    return result.data;
};

export const auth = betterAuth({
    appName: 'myworkout',
    baseURL: AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET!,
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true, // Enable authentication using email and password.
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }
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
        // ...(process.env.NODE_ENV === "development"
        //   ? [
        //       "exp://", // Trust all Expo URLs (prefix matching)
        //       "exp://**", // Trust all Expo URLs (wildcard matching)
        //       "exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path
        //     ]
        //   : []),
    ].filter(Boolean),
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === '/sign-up/email') getOnboarding(ctx.body);
        }),
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path !== '/sign-up/email' || !ctx.context.newSession) return;
            await db.insert(profiles).values({
                userId: ctx.context.newSession.user.id,
                ...getOnboarding(ctx.body),
            });
        }),
    },
    plugins: [expo()],
});