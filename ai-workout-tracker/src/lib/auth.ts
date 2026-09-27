import { db } from "@/database";
import { profiles} from "@/database/schema";
import * as schema from "@/database/schema";
import { expo } from "@better-auth/expo";
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { emailOTP } from "better-auth/plugins";
import { buildVerificationEmailHtml, buildVerificationOtpHtml, sendEmail } from "@/lib/email";
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

/**
 * With email verification required, no session exists at sign-up time, so the
 * profiles row can't be created from the `after` response middleware. Instead,
 * the `before` hook stashes the (already validated) onboarding answers here,
 * and `databaseHooks.user.create.after` consumes them the moment the user row
 * is created — regardless of session state.
 */
const PENDING_ONBOARDING_TTL_MS = 10 * 60 * 1000;
const pendingOnboarding = new Map<string, { values: ReturnType<typeof getOnboarding>; expiresAt: number }>();

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
        // Sign-in is blocked until the email address is verified.
        requireEmailVerification: true,
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Verify your MyWorkout account",
                html: buildVerificationEmailHtml(url, user.name || "there"),
            });

            if (!process.env.RESEND_API_KEY) {
                // Dev fallback: the console fallback in sendEmail skips the
                // send, so log the link so it's still testable locally.
                console.log(`[auth] Verification link for ${user.email}: ${url}`);
            }
        },
    },
    // Built-in rate limiting for all auth endpoints (sign-up, sign-in, etc.).
    rateLimit: {
        enabled: true,
        window: 60,
        max: 30,
        storage: "memory",
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

    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    const pending = pendingOnboarding.get(user.email);
                    pendingOnboarding.delete(user.email);

                    if (!pending || pending.expiresAt <= Date.now()) {
                        return;
                    }

                    await db.insert(profiles).values({
                        userId: user.id,
                        ...pending.values,
                    });
                },
            },
        },
    },

    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                const values = getOnboarding(ctx.body);
                pendingOnboarding.set(ctx.body.email as string, {
                    values,
                    expiresAt: Date.now() + PENDING_ONBOARDING_TTL_MS,
                });
            }
        }),
    },

    plugins: [
        // 6-digit email OTP for account verification (see /verify-email).
        emailOTP({
            otpLength: 6,
            expiresIn: 300,
            allowedAttempts: 5,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    await sendEmail({
                        to: email,
                        subject: "Your MyWorkout verification code",
                        html: buildVerificationOtpHtml(otp),
                    });

                    if (!process.env.RESEND_API_KEY) {
                        console.log(`[auth] Verification code for ${email}: ${otp}`);
                    }
                } else if (type === "sign-in") {
                    await sendEmail({
                        to: email,
                        subject: "Your MyWorkout sign-in code",
                        html: buildVerificationOtpHtml(otp),
                    });

                    if (!process.env.RESEND_API_KEY) {
                        console.log(`[auth] Sign-in code for ${email}: ${otp}`);
                    }
                } else {
                    // Other OTP types (forget-password) are not used yet.
                    console.log(`[auth] OTP (${type}) for ${email}: ${otp}`);
                }
            },
        }),
        expo(),
    ],
});

export type AuthSession = typeof auth.$Infer.Session;