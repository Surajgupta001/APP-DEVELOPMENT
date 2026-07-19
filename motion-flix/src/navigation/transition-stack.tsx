import { withLayoutContext, StackNavigationState } from 'expo-router';
import type { ComponentType, ReactNode } from 'react';
import type { TransitionNavigationOptions } from '@/transitions/types';

type TransitionNavigationEventMap = Record<string, { data?: unknown }>;
export type ParamListBase = Record<string, object | undefined>;

type BlankStackModule = {
    createBlankStackNavigator: () => {
        Navigator: ComponentType<{
            children?: ReactNode;
            screenOptions?: TransitionNavigationOptions;
        }>;
    };
};

declare const require: (id: string) => BlankStackModule;

const { createBlankStackNavigator } = require('react-native-screen-transitions/blank-stack');

const { Navigator } = createBlankStackNavigator();

export const TransitionStack = withLayoutContext<
    TransitionNavigationOptions,
    typeof Navigator,
    StackNavigationState<ParamListBase>,
    TransitionNavigationEventMap
>(Navigator);