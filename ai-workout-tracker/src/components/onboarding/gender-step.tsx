import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { fadeInRight } from "@/lib/animations";
import { OnboardingGender } from "@/lib/validations/onboarding-validation";
import { useAppThemeColor } from "@/theme/app-theme";
import OnboardingOptionCard from "./onboarding-option-card";

type GenderStepProps = {
    onSelect: (value: OnboardingGender) => void;
    value?: OnboardingGender;
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

const GenderStep = ({ value, onSelect }: GenderStepProps) => {
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
                    className="mt-6 max-w-72 font-inter-bold text-[28px] leading-9 tracking-[-0.6px] text-foreground"
                >
                    What&apos;s your gender?
                </Text>

                <Text className="mt-2 max-w-72 font-inter text-[15px] leading-6 text-muted-foreground">
                    This helps us personalize your experience.
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
                                    color={selected ? primary : foreground}
                                    name={option.icon}
                                    size={31}
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
};

export default GenderStep;