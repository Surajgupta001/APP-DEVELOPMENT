import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { fadeInRight } from "@/lib/animations";
import { useAppThemeColor } from "@/theme/app-theme";
import { onboardingGender } from "@/lib/validations/onboarding-validation";
import OnboardingOptionCard from "./onboarding-option-card";

type GenderStepProps = {
    onSelect: (value: onboardingGender) => void;
    value?: onboardingGender;
};

const genderOptions = [
    {
        icon: "mars",
        label: "Male",
        value: "male",
    },
    {
        icon: "venus",
        label: "Female",
        value: "female",
    },
] as const;

export default function GenderStep({ value, onSelect }: GenderStepProps) {
    
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
                    What&apos;s your gender?
                </Text>

                <Text
                    className="mt-2 max-w-72 font-inter text-[15px] leading-6"
                    style={{
                        color: mutedForeground,
                    }}
                >
                    This helps us personalize
                    your experience.
                </Text>
            </Animated.View>

            <View className="gap-4 mt-8">
                {genderOptions.map((option, index) => {
                    const selected = value === option.value;
                    return (
                        <OnboardingOptionCard
                            key={option.value}
                            delay={(index + 1) * 80}
                            icon={
                                <FontAwesome6
                                    name={option.icon}
                                    size={31}
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