import { useEffect, useState } from "react";
import { Animated, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export default function Skeleton({ className, ...props }: ViewProps) {
    const [opacity] = useState(() => new Animated.Value(0.5));

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.5,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]),
        );

        animation.start();

        return () => { animation.stop() };
    }, [opacity]);

    return (
        <Animated.View
            className={cn("rounded-md bg-border", className)}
            style={{ opacity }}
            {...props}
        />
    );
}