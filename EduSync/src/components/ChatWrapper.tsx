import { studyBuddyTheme } from "@/lib/theme";
import type { UserResource } from "@clerk/types";
import { useEffect, useRef } from "react";
import { Chat, OverlayProvider, useCreateChatClient } from "stream-chat-expo";
import { FullScreenLoader } from "./FullScreenLoader";

import * as Sentry from "@sentry/react-native";
import { useUser } from "@clerk/expo";
import { Platform } from "react-native";
import Constants from "expo-constants";

const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

const getBaseUrl = () => {
    if (Platform.OS === "web") {
        return "";
    }
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        return `http://${hostUri}`;
    }
    return process.env.EXPO_PUBLIC_API_URL || "";
};

const syncUserToStream = async (user: UserResource) => {
    try {
        const url = `${getBaseUrl()}/api/sync-user`;
        console.log("[StreamSync] Fetching:", url);
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                name: user.fullName ?? user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                image: user.imageUrl,
            }),
        });
        
        const data = await response.json();
        console.log("[StreamSync] Sync Response Status:", response.status, data);

        if (!response.ok) {
            throw new Error(data.error || "Server responded with an error");
        }
    } catch (error) {
        console.error("[StreamSync] Failed to sync user to Stream:", error);
    }
};

const ChatClient = ({ children, user }: { children: React.ReactNode; user: UserResource }) => {
    const syncedRef = useRef(false);

    useEffect(() => {
        // this if statements is needed so that we don't run this method multiple times. only once!
        if (!syncedRef.current) {
            syncedRef.current = true;
            syncUserToStream(user);
        }
    }, [user]);

    const tokenProvider = async () => {
        try {
            const url = `${getBaseUrl()}/api/token`;
            console.log("[StreamSync] Fetching token:", url);
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            });
            const data = await response.json();
            console.log("[StreamSync] Token Response Status:", response.status, data);
            
            if (!response.ok) {
                throw new Error(data.error || "Server responded with an error");
            }
            return data.token;
        } catch (error) {
            Sentry.logger.error("Failed to get Stream chat token", {
                userId: user.id,
                message: error instanceof Error ? error.message : String(error),
            });
            Sentry.captureException(error, { extra: { userId: user.id, hook: "tokenProvider" } });
            console.error("[StreamSync] Failed to get Stream chat token:", error);
        }
    };

    const chatClient = useCreateChatClient({
        apiKey: STREAM_API_KEY,
        userData: {
            id: user.id,
            name: user.fullName ?? user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
            image: user.imageUrl,
        },
        tokenOrProvider: tokenProvider,
    });

    if (!chatClient) return <FullScreenLoader message="Loading chat..." />;

    return (
        <OverlayProvider value={{ style: studyBuddyTheme }}>
            <Chat client={chatClient} style={studyBuddyTheme}>
                {children}
            </Chat>
        </OverlayProvider>
    );
};

const ChatWrapper = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return <FullScreenLoader message="Loading chat..." />;

    // not signed in — render children directly (auth screens)
    if (!user) return <>{children}</>;

    return <ChatClient user={user}>{children}</ChatClient>;
};
export default ChatWrapper;

// TODO: ADD sentry logs link in the video