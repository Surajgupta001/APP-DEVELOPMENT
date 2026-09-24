import { API_URL, authClient } from "./auth-client";

export type CreateWorkoutInput = {
    name: string;
    description?: string;
    image?: string;
    exercises: {
        id: string;
        reps?: number;
        rest?: number;
        sets?: number;
    }[];
};

export type ExerciseItem = {
    category: string;
    description: string;
    difficulty: string;
    equipment: string | null;
    forceType: string | null;
    id: string;
    image: string | null;
    mechanics: string | null;
    muscles: string;
    name: string;
};

export async function createWorkoutMutationFn(data: CreateWorkoutInput) {
    const { data: result, error } = await authClient.$fetch(
        `${API_URL}/api/workouts`,
        {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    if (error) throw new Error("Could not create workout");

    return result;
}

export async function getExercisesQueryFn(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const { data, error } = await authClient.$fetch<ExerciseItem[]>(
        `${API_URL}/api/exercises${query}`,
        {
            method: "GET",
        },
    );
    if (error) throw new Error("Could not fetch exercises");

    return data;
}