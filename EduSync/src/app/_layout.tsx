import { Stack } from "expo-router";
import "../../global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import * as Sentry from "@sentry/react-native";

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Add your Clerk Publishable Key to the .env file"
  );
}

Sentry.init({
  dsn: "https://da48e472723744541ced1763fba78888@o4511401321299968.ingest.us.sentry.io/4511423924535296",

  // Adds more context data
  sendDefaultPii: true,

  // Enable logs
  enableLogs: true,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,

  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // spotlight: __DEV__,
});

function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <GestureHandlerRootView className="flex-1">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}

export default Sentry.wrap(RootLayout);