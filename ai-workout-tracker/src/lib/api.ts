import { API_URL, authClient } from "./auth-client";

export type CreateWorkoutInput = {
    name: string;
    description?: string;
    image?: string;
    exercises: {
        id: string;
        reps?: number;
        sets?: number;
        rests?: number;
    }[];
};

export async function createWorkoutMutationFn(data: CreateWorkoutInput) {
    const response = await fetch(`${API_URL}/workouts`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            cookie: authClient.getCookies(),
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to create workout: ${response.statusText}`);
    }

    return response.json();
};