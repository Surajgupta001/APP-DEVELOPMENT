import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { OnboardingValues, onboardingValuesSchema } from "@/lib/validations/onboarding-validation";

const ONBOARDING_KEY = "myworkout-onboarding-answers";

export const answers: Partial<OnboardingValues> = {};

export const steps = [
    {
        field: "gender",
        key: "gender",
    },
    {
        field: "experience",
        key: "experience",
    },
    {
        field: "goal",
        key: "goal",
    },
] as const;

const isClient = Platform.OS !== "web" || typeof window !== "undefined";

export const loadOnboardingAnswers = async (): Promise<void> => {
    if (!isClient) return;
    try {
        const data = await AsyncStorage.getItem(ONBOARDING_KEY);

        if (!data) return;

        const parsedData = JSON.parse(data);

        const result = onboardingValuesSchema.partial().safeParse(parsedData);

        if (!result.success) {
            console.error("Invalid saved onboarding answers:", result.error);
            return;
        }
        Object.assign(answers, result.data);
    } catch (error) {
        console.error("Error retrieving onboarding answers:", error);
    }
};

export const saveOnboardingAnswers = async <K extends keyof OnboardingValues>(field: K, value: OnboardingValues[K]): Promise<void> => {
    answers[field] = value;

    if (!isClient) return;

    try {
        await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(answers),);
    } catch (error) {
        console.error("Error saving onboarding answers:", error);
    }
};

export const isOnboardingComplete = (): boolean => {
    return onboardingValuesSchema.safeParse(answers).success;
};

export const getOnboardingAnswers = () => {
    return onboardingValuesSchema.safeParse(answers);
};

export const resetOnboardingAnswers = async (): Promise<void> => {
    steps.forEach((step) => {
        delete answers[step.field as keyof OnboardingValues];
    });

    if (!isClient) return;

    try {
        await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
        console.error("Error resetting onboarding answers:", error);
    }
};

export const stepIndex = (key: string): number => {
    return steps.findIndex(
        (step) => step.key === key,
    );
};