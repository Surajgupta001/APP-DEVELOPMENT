import {
    getExerciseInstructionsQueryFn,
    getExerciseQueryFn,
    getExercisesQueryFn,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useExercisesQuery(search: string) {
    return useQuery({
        queryKey: ["exercises", search],
        queryFn: () => getExercisesQueryFn(search),
    });
}

export function useExerciseInstructionsQuery(id: string, enabled = true) {
    return useQuery({
        queryKey: ["exercise-instructions", id],
        queryFn: () => getExerciseInstructionsQueryFn(id),
        enabled: enabled && Boolean(id),
    });
}

export function useExerciseQuery(id: string) {
    return useQuery({
        queryKey: ["exercise", id],
        queryFn: () => getExerciseQueryFn(id),
        enabled: Boolean(id),
    });
}
