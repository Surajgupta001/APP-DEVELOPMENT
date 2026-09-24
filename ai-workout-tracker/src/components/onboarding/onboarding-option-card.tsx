import { Feather } from "@expo/vector-icons";
import { ReactNode, useEffect, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { cn } from "@/lib/utils";
import { fadeInRight } from "@/lib/animations";
import { useAppThemeColor } from "@/theme/app-theme";

type OnboardingOptionCardProps = {
    delay?: number;
    description?: string;
    icon: ReactNode;
    label: string;
    onPress: () => void;
    selected: boolean;
};

const OnboardingOptionCard = ({
    delay = 0,
    description,
    icon,
    label,
    onPress,
    selected,
}: OnboardingOptionCardProps) => {
    const primaryForeground = useAppThemeColor("primaryForeground");

    const [translateX] = useState(() => new Animated.Value(20));
    const [opacity] = useState(() => new Animated.Value(0));

    useEffect(() => {
        const animation = fadeInRight(translateX, opacity, 250, delay);
        animation.start();

        return () => {
            animation.stop();
        };
    }, [delay, translateX, opacity]);

    return (
        <Animated.View
            style={{
                opacity,
                transform: [{ translateX }],
            }}
        >
            <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                className={cn(
                    "min-h-20 flex-row items-center rounded-xl border bg-card px-5 py-4",
                    selected ? "border-primary" : "border-border",
                )}
                onPress={onPress}
            >
                <View className="items-center justify-center size-10">
                    {icon}
                </View>

                <View className="flex-row justify-between flex-1 ml-4">
                    <Text
                        className={cn(
                            "font-inter-semibold text-[15px] leading-5",
                            selected ? "text-primary" : "text-foreground",
                        )}
                    >
                        {label}
                    </Text>

                    {selected ? (
                        <View className="items-center justify-center w-6 h-6 rounded-full bg-primary">
                            <Feather
                                color={primaryForeground}
                                name="check"
                                size={15}
                            />
                        </View>
                    ) : (
                        <View className="w-6 h-6 border-2 rounded-full border-input-border" />
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
};

export default OnboardingOptionCard;