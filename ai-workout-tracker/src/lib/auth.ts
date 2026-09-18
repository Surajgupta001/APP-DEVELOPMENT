import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@/database/schema';
import { db } from '@/database'

const AUTH_URL = process.env.BETTER_AUTH_URL!

export const auth = betterAuth({
    appName: 'myworkout',
    baseURL: AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET!,
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: schema,
    }),
    trustedOrigins: [
        "aiworkouttracker://",
        "aiworkouttracker://*",
        "exp://",
        "exp://*",
        "exp://**",
        "exp://192.168.*.*:*/**",
        "http://localhost:*",
        "http://192.168.*.*:*",

        AUTH_URL,
        // ...(process.env.NODE_ENV === "development"
        //   ? [
        //       "exp://", // Trust all Expo URLs (prefix matching)
        //       "exp://**", // Trust all Expo URLs (wildcard matching)
        //       "exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path
        //     ]
        //   : []),
    ].filter(Boolean),
    plugins: [expo()],
    emailAndPassword: {
        enabled: true, // Enable authentication using email and password.
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }
    }
});