import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { fadeInRight } from "@/lib/animations";
import { OnboardingExperience } from "@/lib/validations/onboarding-validation";
import { useAppThemeColor } from "@/theme/app-theme";
import OnboardingOptionCard from "./onboarding-option-card";

type ExperienceStepProps = {
    onSelect: (value: OnboardingExperience) => void;
    value?: OnboardingExperience;
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

export default function ExperienceStep({
    onSelect,
    value,
}: ExperienceStepProps) {
    const foreground = useAppThemeColor("foreground");
    const primary = useAppThemeColor("primary");

    const [translateX] = useState(() => new Animated.Value(20));
    const [opacity] = useState(() => new Animated.Value(0));

    useEffect(() => {
        const animation = fadeInRight(translateX, opacity, 250);
        animation.start();

        return () => {
            animation.stop();
        };
    }, [translateX, opacity]);

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
                    className="mt-6 max-w-80 font-inter-bold text-[28px] leading-9 tracking-[-0.6px] text-foreground"
                >
                    What&apos;s your training experience?
                </Text>

                <Text className="mt-2 max-w-72 font-inter text-[15px] leading-6 text-muted-foreground">
                    Select your current experience level.
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
                                    color={selected ? primary : foreground}
                                    name={option.icon}
                                    size={27}
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