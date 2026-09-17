import { z } from "zod";

export const onboardingValuesSchema = z.object({
    experience: z.enum(["beginner", "intermediate", "advanced"]),
    gender: z.enum(["male", "female"]),
    goal: z.enum(['build-muscle', 'lose-fat', 'maintain']),
});

export type OnboardingValues = z.infer<typeof onboardingValuesSchema>;
export type onboardingExperience = OnboardingValues['experience'];
export type onboardingGender = OnboardingValues['gender'];
export type onboardingGoal = OnboardingValues['goal'];