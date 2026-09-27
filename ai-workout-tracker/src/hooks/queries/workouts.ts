import { getWorkoutQueryFn, getWorkoutsQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useWorkoutsQuery(limit?: number) {
    return useQuery({
        queryKey: ["workouts", { limit }],
        queryFn: () => getWorkoutsQueryFn(limit),
    });
}

export function useWorkoutQuery(id: string) {
    return useQuery({
        queryKey: ["workout", id],
        queryFn: () => getWorkoutQueryFn(id),
        enabled: Boolean(id),
    });
}
