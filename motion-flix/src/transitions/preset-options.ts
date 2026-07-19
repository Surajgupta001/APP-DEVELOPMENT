import { Extrapolation, interpolate } from "react-native-reanimated";

import type { TransitionNavigationOptions } from "@/transitions/types";

const INK = "#F7F4EE";
const SCRIM = "#17130F";
const clamp = Extrapolation.CLAMP;

const closeSpec = {
  stiffness: 390,
  damping: 66,
  mass: 1.4,
  overshootClamping: true,
  restSpeedThreshold: 0.02,
};

const openSpec = {
  stiffness: 680,
  damping: 68,
  mass: 0.9,
  overshootClamping: true,
};

const defaultTransitionSpec = {
  open: openSpec,
  close: closeSpec,
};

const snapSpec = {
  stiffness: 500,
  damping: 50,
  mass: 1,
};

const dimBackdrop = (
  activeProgress: number,
  opacity: number,
  color = SCRIM,
) => {
  "worklet";

  return {
    style: {
      backgroundColor: color,
      opacity: interpolate(activeProgress, [0, 1], [0, opacity], clamp),
    },
  };
};

const createVerticalSlideTransition = (
  from: "top" | "bottom",
): TransitionNavigationOptions => ({
  gestureEnabled: from === "bottom",
  gestureDirection: from === "top" ? "vertical-inverted" : "vertical",
  screenStyleInterpolator: ({ progress, layouts }) => {
    "worklet";

    const height = layouts.screen.height;
    const closedY = from === "top" ? -height : height;

    return {
      content: {
        style: {
          transform: [
            {
              translateY: interpolate(
                progress,
                [0, 1, 2],
                [closedY, 0, -closedY],
                clamp,
              ),
            },
          ],
        },
      },
    };
  },
  transitionSpec: defaultTransitionSpec,
});

export const searchTransition = createVerticalSlideTransition("top");

export const bottomSheetLikeTransition =
  createVerticalSlideTransition("bottom");

const createSheetTransition = (
  snapPoints: (number | "auto")[],
  backdropBehavior: "collapse" | "dismiss",
): TransitionNavigationOptions => ({
  gestureEnabled: true,
  gestureDirection: "vertical",
  snapPoints,
  initialSnapIndex: 0,
  backdropBehavior,
  sheetScrollGestureBehavior: "expand-and-collapse",
  screenStyleInterpolator: ({ active, focused, progress, layouts }) => {
    "worklet";

    if (!focused) {
      return {
        content: {
          style: {
            transform: [
              { scale: interpolate(progress, [1.5, 2], [1, 0.93], clamp) },
            ],
          },
        },
      };
    }

    return {
      content: {
        style: {
          backgroundColor: INK,
          borderTopLeftRadius: 34,
          borderTopRightRadius: 34,
          overflow: "hidden",
          transform: [
            {
              translateY: interpolate(
                progress,
                [0, 1],
                [layouts.screen.height, 0],
                clamp,
              ),
            },
          ],
        },
      },
      backdrop: dimBackdrop(active.progress, 1, "rgba(23,19,15,0.34)"),
    };
  },
  transitionSpec: {
    open: openSpec,
    close: closeSpec,
    expand: snapSpec,
    collapse: snapSpec,
  },
});

export const watchlistSheetTransition = createSheetTransition(
  [0.74, 1],
  "collapse",
);

export const shareSheetTransition = createSheetTransition([0.72, 1], "dismiss");

export const filterDrawerTransition: TransitionNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: "horizontal-inverted",
  backdropBehavior: "dismiss",
  screenStyleInterpolator: ({ active, focused, progress, layouts }) => {
    "worklet";

    if (!focused) {
      return {
        content: {
          style: {
            transform: [
              { scale: interpolate(progress, [1.5, 2], [1, 0.96], clamp) },
            ],
          },
        },
      };
    }

    return {
      content: {
        style: {
          backgroundColor: "transparent",
          transform: [
            {
              translateX: interpolate(
                progress,
                [0, 1],
                [layouts.screen.width, 0],
                clamp,
              ),
            },
          ],
        },
      },
      backdrop: dimBackdrop(active.progress, 1, "rgba(23,19,15,0.28)"),
    };
  },
  transitionSpec: {
    open: openSpec,
    close: closeSpec,
  },
};

export const containedZoomTransition: TransitionNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: "horizontal",
  gestureActivationArea: { left: "edge" },
  screenStyleInterpolator: ({ active, focused, progress }) => {
    "worklet";

    if (!focused) {
      return {
        content: {
          style: {
            opacity: interpolate(progress, [1, 2], [1, 0.78], clamp),
            transform: [
              { scale: interpolate(progress, [1, 2], [1, 0.9], clamp) },
            ],
          },
        },
        backdrop: dimBackdrop(active.progress, 0.18, INK),
      };
    }

    return {
      content: {
        style: {
          backgroundColor: INK,
          borderRadius: interpolate(progress, [0, 1], [36, 0], clamp),
          opacity: active.closing
            ? interpolate(progress, [0, 0.28, 1], [0, 0.72, 1], clamp)
            : interpolate(progress, [0, 1], [0.9, 1], clamp),
          overflow: "hidden",
          transform: [
            { scale: interpolate(progress, [0, 1], [0.82, 1], clamp) },
            { translateY: interpolate(progress, [0, 1], [34, 0], clamp) },
          ],
        },
      },
      backdrop: dimBackdrop(active.progress, 0.16, INK),
    };
  },
  transitionSpec: {
    open: openSpec,
    close: closeSpec,
  },
};

export const verticalDismissZoomTransition: TransitionNavigationOptions = {
  ...containedZoomTransition,
  gestureDirection: "vertical",
  gestureActivationArea: "screen",
};