import { Animated, Easing } from "react-native";

export const fadeInRight = (
    translateX: Animated.Value,
    opacity: Animated.Value,
    duration = 250,
    delay = 0,
) => {
    translateX.setValue(20);
    opacity.setValue(0);

    return Animated.parallel([
        Animated.timing(translateX, {
            toValue: 0,
            duration,
            delay,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }),
        Animated.timing(opacity, {
            toValue: 1,
            duration,
            delay,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }),
    ]);
};