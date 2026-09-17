import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { fadeInRight } from "@/lib/animations";
import { useAppThemeColor } from "@/theme/app-theme";
import { onboardingExperience } from "@/lib/validations/onboarding-validation";
import OnboardingOptionCard from "./onboarding-option-card";

type ExperienceStepProps = {
    onSelect: (value: onboardingExperience) => void;
    value?: onboardingExperience;
};

const experienceOptions = [
    {
        description: "New to training",
        icon: "zap",
        label: "Beginner",
        value: "beginner",
    },
    {
        description: "Trained for a while",
        icon: "target",
        label: "Intermediate",
        value: "intermediate",
    },
    {
        description: "Very experienced",
        icon: "award",
        label: "Advanced",
        value: "advanced",
    },
] as const;

export default function ExperienceStep({ value, onSelect }: ExperienceStepProps) {
    
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
                    className="mt-6 max-w-80 font-inter-bold text-[28px] leading-9 tracking-[-0.6px]"
                    style={{
                        color: foreground,
                    }}
                >
                    What&apos;s your training
                    experience?
                </Text>

                <Text
                    className="mt-2 max-w-72 font-inter text-[15px] leading-6"
                    style={{
                        color: mutedForeground,
                    }}
                >
                    Select your current
                    experience level.
                </Text>
            </Animated.View>

            <View
                accessibilityRole="radiogroup"
                className="gap-4 mt-6"
            >
                {experienceOptions.map((option, index) => {
                    const selected = value === option.value;
                    return (
                        <OnboardingOptionCard
                            key={option.value}
                            delay={(index + 1) * 80}
                            description={option.description}
                            icon={
                                <Feather
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