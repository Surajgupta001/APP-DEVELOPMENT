import "../../global.css";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { appThemeColors, appThemes } from "@/theme/app-theme";
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { authClient } from "@/lib/auth-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: appThemeColors.light.background,
    },
  },

  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: appThemeColors.dark.background,
    },
  },
};

export default function RootLayout() {

  const [appReady, setAppReady] = useState(false);

  const [queryClient] = useState(() => new QueryClient());

  const [loaded, error] = useFonts({
    ...Feather.font,
    ...FontAwesome.font,
    ...FontAwesome6.font,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";

  const backgroundColor = appThemeColors[scheme].background;

  const fontReady = loaded && !error;

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!appReady && fontReady && !isPending) {
      SplashScreen.hideAsync().then(() => {
        setAppReady(true);
      });
    }
  }, [appReady, fontReady, isPending]);

  if (!appReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <ThemeProvider value={navigationTheme[scheme]}>
          <View
            style={[
              appThemes[scheme],
              {
                backgroundColor,
                flex: 1,
              },
            ]}
          >
            <StatusBar
              key={scheme}
              animated
              style={scheme === "dark" ? "light" : "dark"}
            />

            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Protected guard={!session}>
                <Stack.Screen name="(public)" />
              </Stack.Protected>
              <Stack.Protected guard={!!session}>
                <Stack.Screen name="(app)" />
              </Stack.Protected>
            </Stack>
          </View>
        </ThemeProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}