import type {
    CreateWorkoutInput,
    SaveSessionInput,
} from "@/types";
import {
    createWorkoutMutationFn,
    createWorkoutSessionMutationFn,
} from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useCreateWorkoutMutation() {
    return useMutation({
        mutationFn: (data: CreateWorkoutInput) => createWorkoutMutationFn(data),
    });
}

export function useCreateWorkoutSessionMutation() {
    return useMutation({
        mutationFn: (data: SaveSessionInput) =>
            createWorkoutSessionMutationFn(data),
    });
}
