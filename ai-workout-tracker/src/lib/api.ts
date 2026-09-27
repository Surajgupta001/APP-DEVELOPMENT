import { addDays, startOfDay } from "date-fns";
import { API_URL, authClient } from "./auth-client";
import type {
    CreateWorkoutInput,
    ExerciseItem,
    HistoryDetail,
    HistorySessionItem,
    HomeStats,
    SaveSessionInput,
    WorkoutCalendarDates,
    WorkoutDetail,
    WorkoutListItem,
} from "@/types";

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

export async function getWorkoutsQueryFn(limit?: number) {
    const { data, error } = await authClient.$fetch<WorkoutListItem[]>(
        `${API_URL}/api/workouts${limit ? `?limit=${limit}` : ""}`,
        {
            method: "GET",
        },
    );
    if (error) throw new Error("Could not load workouts");

    return data;
}

export async function getWorkoutQueryFn(id: string) {
    const { data, error } = await authClient.$fetch<WorkoutDetail>(
        `${API_URL}/api/workouts/${id}`,
        {
            method: "GET",
        },
    );
    if (error) throw new Error("Could not create workout");

    return data;
}

export async function getExercisesQueryFn(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const { data, error } = await authClient.$fetch<ExerciseItem[]>(
        `${API_URL}/api/exercises${query}`,
        {
            method: "GET",
        },
    );
    if (error) throw new Error("Could not load exercises");

    return data;
}

export async function getExerciseQueryFn(id: string) {
    const { data, error } = await authClient.$fetch<ExerciseItem>(
        `${API_URL}/api/exercises/${id}`,
        {
            method: "GET",
        },
    );
    if (error) throw new Error("Could not load exercise");

    return data;
}

export async function getExerciseInstructionsQueryFn(id: string) {
    const { data, error } = await authClient.$fetch<{
        instructions: string[];
    }>(`${API_URL}/api/exercises/${id}/instructions`, {
        method: "GET",
    });
    if (error) throw new Error("Could not load exercise instructions");

    return data;
}

export async function createWorkoutSessionMutationFn(data: SaveSessionInput) {
    const { data: result, error } = await authClient.$fetch(
        `${API_URL}/api/workout-sessions`,
        {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    if (error) throw new Error("Could not save workout session");

    return result;
}

export async function getHistoryQueryFn(limit?: number) {
    const query = limit === undefined ? "" : `?limit=${limit}`;
    const { data, error } = await authClient.$fetch<HistorySessionItem[]>(
        `${API_URL}/api/workout-sessions${query}`,
        {
            method: "GET",
        },
    );
    if (error) throw new Error("Could not load history");

    return data;
}

export async function getHistoryDetailQueryFn(id: string) {
    const { data, error } = await authClient.$fetch<HistoryDetail>(
        `${API_URL}/api/workout-sessions/${id}`,
        {
            method: "GET",
        },
    );
    if (error) throw new Error("Could not load history session");

    return data;
}

export async function getHomeStatsQueryFn(date: Date) {
    const start = startOfDay(date);
    const end = addDays(start, 1); // beginning of the following day
    const query = new URLSearchParams({
        end: end.toISOString(),
        start: start.toISOString(),
    });

    const { data, error } = await authClient.$fetch<HomeStats>(
        `${API_URL}/api/home-stats?${query}`,
        {
            method: "GET",
        },
    );
    if (error) throw new Error("Could not load home stats");

    return data;
}

export async function getWorkoutCalendarDatesQueryFn(start: Date, end: Date) {
    const query = new URLSearchParams({
        end: end.toISOString(),
        start: start.toISOString(),
    });

    const { data, error } = await authClient.$fetch<WorkoutCalendarDates>(
        `${API_URL}/api/workout-sessions/calendar?${query}`,
        {
            method: "GET",
        },
    );
    if (error) throw new Error("Could not load workout dates");

    return data;
}

export async function getStreakQueryFn() {
    const { data, error } = await authClient.$fetch<WorkoutCalendarDates>(
        `${API_URL}/api/workout-sessions/streak`,
        { method: "GET" },
    );
    if (error) throw new Error("Could not load streak");

    return data;
}