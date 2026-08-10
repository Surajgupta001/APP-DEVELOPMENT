import { z } from "zod";

export const onboardingSchema = z.object({
    startingBalance: z
        .string()
        .min(1, 'Starting balance is required')
        .refine((v) => {
            const parsed = parseFloat(v.replace(/,/g, ''));
            return !Number.isNaN(parsed) && parsed >= 0;
        }, 'Please enter a valid number for starting balance')
});

export type OnboardingData = z.infer<typeof onboardingSchema>;