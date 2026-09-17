import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { fadeInRight } from "@/lib/animations";
import { useAppThemeColor } from "@/theme/app-theme";
import { onboardingGoal } from "@/lib/validations/onboarding-validation";
import OnboardingOptionCard from "./onboarding-option-card";

type GoalStepProps = {
    onSelect: (value: onboardingGoal) => void;
    value?: onboardingGoal;
};

const goalOptions = [
    {
        icon: "dumbbell",
        label: "Build Muscle",
        value: "build-muscle",
    },
    {
        icon: "fire-flame-simple",
        label: "Lose Fat",
        value: "lose-fat",
    },
    {
        icon: "scale-balanced",
        label: "Maintain",
        value: "maintain",
    },
] as const;

export default function GoalStep({ onSelect, value }: GoalStepProps) {

    const foreground = useAppThemeColor("foreground");
    const primary = useAppThemeColor("primary");
    const mutedForeground = useAppThemeColor("mutedForeground");

    const [translateX] = useState(() => new Animated.Value(20));

    const [opacity] = useState(() => new Animated.Value(0));

    useEffect(() => {
        fadeInRight(
            translateX,
            opacity,
        ).start();

        return () => {
            translateX.stopAnimation();
            opacity.stopAnimation();
        };
    }, [opacity, translateX]);

    return (
        <View className="flex-1">
            <Animated.View
                style={{
                    opacity,
                    transform: [{ translateX }],
                }}
            >
                <Text
                    accessibilityRole="header"
                    className="mt-6 max-w-72 font-inter-bold text-[28px] leading-9 tracking-[-0.6px]"
                    style={{
                        color: foreground,
                    }}
                >
                    What&apos;s your goal?
                </Text>

                <Text
                    className="mt-2 max-w-72 font-inter text-[15px] leading-6"
                    style={{
                        color: mutedForeground,
                    }}
                >
                    Choose the goal that
                    matters most to you.
                </Text>
            </Animated.View>

            <View
                accessibilityRole="radiogroup"
                className="gap-4 mt-8"
            >
                {goalOptions.map((option, index) => {
                    const selected = value === option.value;
                    return (
                        <OnboardingOptionCard
                            key={option.value}
                            delay={(index + 1) * 80}
                            icon={
                                <FontAwesome6
                                    name={option.icon}
                                    size={27}
                                    color={selected ? primary : foreground}
                                />
                            }
                            label={option.label}
                            onPress={() => onSelect(option.value)}
                            selected={selected}
                        />
                    );
                })}
            </View>
        </View>
    );
}