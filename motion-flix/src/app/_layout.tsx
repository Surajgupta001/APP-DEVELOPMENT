import { ThemeProvider } from "expo-router";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { palette } from "@/components/movie-ui";
import { TransitionStack as Stack } from "@/navigation/transition-stack";
import {
  bottomSheetLikeTransition,
  containedZoomTransition,
  filterDrawerTransition,
  searchTransition,
  shareSheetTransition,
  verticalDismissZoomTransition,
  watchlistSheetTransition,
} from "@/transitions/preset-options";

const MotionFlixTheme = {
  dark: false,
  colors: {
    primary: palette.red,
    background: palette.ink,
    card: palette.ink,
    text: palette.text,
    border: palette.line,
    notification: palette.red,
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "400" as const },
    medium: { fontFamily: "System", fontWeight: "500" as const },
    bold: { fontFamily: "System", fontWeight: "700" as const },
    heavy: { fontFamily: "System", fontWeight: "900" as const },
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={MotionFlixTheme}>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          detachPreviousScreen: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="movie/[id]" options={containedZoomTransition} />
        <Stack.Screen
          name="gallery/[movieId]"
          options={containedZoomTransition}
        />
        <Stack.Screen
          name="trailer/[id]"
          options={verticalDismissZoomTransition}
        />
        <Stack.Screen name="person/[id]" options={bottomSheetLikeTransition} />
        <Stack.Screen
          name="watchlist-sheet"
          options={watchlistSheetTransition}
        />
        <Stack.Screen name="filters" options={filterDrawerTransition} />
        <Stack.Screen name="search" options={searchTransition} />
        <Stack.Screen name="share-sheet" options={shareSheetTransition} />
      </Stack>
    </ThemeProvider>
  );
}