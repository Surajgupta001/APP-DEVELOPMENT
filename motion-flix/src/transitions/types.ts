export type TransitionInterpolationProps = {
    active: {
        closing: number;
        progress: number;
    };
    focused: boolean;
    progress: number;
    layouts: {
        screen: {
            height: number;
            width: number;
        };
    };
};

type TransitionSlot = {
    style?: Record<string, unknown>;
    props?: Record<string, unknown>;
};

type TransitionSpec = Record<string, Record<string, number | boolean>>;

export type TransitionNavigationOptions = {
    backdropBehavior?: 'block' | 'passthrough' | 'dismiss' | 'collapse';
    detachPreviousScreen?: boolean;
    gestureActivationArea?: 'screen' | { bottom?: number | string; left?: number | string; right?: number | string; top?: number | string };
    gestureDirection?: 'horizontal' | 'horizontal-inverted' | 'vertical' | 'vertical-inverted';
    gestureEnabled?: boolean;
    initialSnapIndex?: number;
    screenStyleInterpolator?: (
        props: TransitionInterpolationProps,
    ) => Record<string, TransitionSlot | undefined> | null | undefined;
    sheetScrollGestureBehavior?: 'expand-and-collapse' | 'collapse-only';
    snapPoints?: (number | 'auto')[];
    transitionSpec?: TransitionSpec;
};