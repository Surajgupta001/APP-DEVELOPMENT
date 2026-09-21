import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { BetterAuthClientPlugin } from "better-auth";

export const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export const authClient = createAuthClient({
    baseURL: API_URL,
    plugins: [
        expoClient({
            scheme: "aiworkouttracker",
            storagePrefix: "myworkout",
            storage: SecureStore,
        }) as BetterAuthClientPlugin
    ]
});