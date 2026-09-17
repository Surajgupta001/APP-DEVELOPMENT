import { useState } from "react";
import { Pressable, View } from "react-native";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAppThemeColor } from "@/theme/app-theme";
import { OnboardingValues } from "@/lib/validations/onboarding-validation";
import { answers, saveOnboardingAnswers, stepIndex, steps } from "@/constants/onboarding";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Button from "@/components/ui/button";
import GenderStep from "@/components/onboarding/gender-step";
import ExperienceStep from "@/components/onboarding/experience-step";
import GoalStep from "@/components/onboarding/goal-step";

export default function OnboardingStep() {
    const { step: key = "" } = useLocalSearchParams<{ step: string }>();

    const router = useRouter();

    const foreground = useAppThemeColor("foreground");

    const [values, setValues] = useState<Partial<OnboardingValues>>(
        () => ({ ...answers, }),
    );

    const index = stepIndex(key);
    const step = steps[index];

    if (!step) {
        return <Redirect href="/welcome" />;
    }

    const next = steps[index + 1];

    const onSelect = (value: OnboardingValues[typeof step.field]) => {
        const nextValues: Partial<OnboardingValues> = {
            ...values,
            [step.field]: value,
        };

        setValues(nextValues);
        saveOnboardingAnswers(step.field, value);
    };

    const goBack = () => {
        if (index === 0) {
            router.replace("/welcome");
            return;
        }
        router.back();
    };

    const goNext = () => {
        if (next) {
            router.push({
                pathname: "/onboarding/[step]",
                params: { step: next.key },
            });

            return;
        }
        router.replace("/sign-up");
    };

    const isCurrentStepComplete = Boolean(values[step.field]);

    return (
        <SafeAreaScreen>
            <View className="flex-1 px-6 pt-4 pb-5">
                {/* Header */}
                <View className="flex-row items-center gap-2">
                    <Pressable
                        className="items-center justify-center -ml-3 rounded-full h-11 w-11 active:bg-muted"
                        onPress={goBack}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Feather
                            name="arrow-left"
                            size={23}
                            color={foreground}
                        />
                    </Pressable>

                    {/* Progress */}
                    <View className="flex-1 h-2 overflow-hidden rounded-full bg-border">
                        <View
                            className="h-full rounded-full bg-primary"
                            style={{width: `${((index + 1) / steps.length) * 100}%`}}
                        />
                    </View>
                </View>

                {/* Step */}
                {step.key === "gender" && (<GenderStep  value={values.gender} onSelect={onSelect} />)}

                {step.key === "experience" && (<ExperienceStep value={ values.experience } onSelect={onSelect} />)}
                
                {step.key === "goal" && (<GoalStep value={values.goal} onSelect={onSelect} />)}
                
                {/* Continue */}
                <Button
                    disabled={!isCurrentStepComplete}
                    onPress={goNext}
                >
                    {next ? "Next" : "Continue to Sign Up"}
                </Button>
            </View>
        </SafeAreaScreen>
    );
}