import { ReactNode, useEffect, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
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

export default function OnboardingOptionCard({
    delay = 0,
    description,
    icon,
    label,
    onPress,
    selected,
}: OnboardingOptionCardProps) {
    
    const primary = useAppThemeColor("primary");
    const primaryForeground = useAppThemeColor("primaryForeground");
    const foreground = useAppThemeColor("foreground");
    const border = useAppThemeColor("border");
    const inputBorder = useAppThemeColor("inputBorder");
    const card = useAppThemeColor("card");

    const [translateX] = useState(() => new Animated.Value(20));

    const [opacity] = useState(() => new Animated.Value(0));

    useEffect(() => {
        fadeInRight(
            translateX,
            opacity,
            250,
            delay,
        ).start();

        return () => {
            translateX.stopAnimation();
            opacity.stopAnimation();
        };
    }, [delay, opacity, translateX]);

    return (
        <Animated.View
            style={{
                opacity,
                transform: [{ translateX }],
            }}
        >
            <Pressable
                accessibilityRole="radio"
                accessibilityState={{
                    checked: selected,
                }}
                className="flex-row items-center px-5 py-4 min-h-20 rounded-xl"
                style={{
                    backgroundColor: card,
                    borderWidth: 1,
                    borderColor: selected ? primary : border,
                }}
                onPress={onPress}
            >
                <View className="items-center justify-center size-10">
                    {icon}
                </View>

                <View className="flex-row items-center justify-between flex-1 ml-4">
                    <View className="flex-1">
                        <Text
                            className="font-inter-semibold text-[15px] leading-5"
                            style={{
                                color: selected ? primary : foreground,
                            }}
                        >
                            {label}
                        </Text>

                        {description && (
                            <Text
                                className="mt-1 font-inter text-[13px] leading-5"
                                style={{
                                    color: foreground,
                                    opacity: 0.65,
                                }}
                            >
                                {description}
                            </Text>
                        )}
                    </View>

                    {selected ? (
                        <View
                            className="items-center justify-center ml-3 rounded-full size-6"
                            style={{
                                backgroundColor: primary,
                            }}
                        >
                            <Feather
                                name="check"
                                size={15}
                                color={primaryForeground}
                            />
                        </View>
                    ) : (
                        <View
                            className="ml-3 border-2 rounded-full size-6"
                            style={{
                                borderColor: inputBorder,
                            }}
                        />
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
}