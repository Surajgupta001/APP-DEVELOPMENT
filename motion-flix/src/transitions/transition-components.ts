import { FlatList, ScrollView } from 'react-native';

type TransitionModule = {
    FlatList?: typeof FlatList;
    ScrollView?: typeof ScrollView;
    default?: {
        FlatList?: typeof FlatList;
        ScrollView?: typeof ScrollView;
    };
};

declare const require: (id: string) => TransitionModule;

const transitionModule = require('react-native-screen-transitions');
const resolvedModule = transitionModule.default ?? transitionModule;

export const TransitionFlatList = resolvedModule.FlatList ?? FlatList;
export const TransitionScrollView = resolvedModule.ScrollView ?? ScrollView;