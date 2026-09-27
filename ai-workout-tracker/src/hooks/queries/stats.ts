import {
    getHomeStatsQueryFn,
    getStreakQueryFn,
    getWorkoutCalendarDatesQueryFn,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useHomeStatsQuery(date: Date) {
    return useQuery({
        queryKey: ["home-stats", date],
        queryFn: () => getHomeStatsQueryFn(date),
    });
}

export function useWorkoutCalendarDatesQuery(start: Date, end: Date) {
    return useQuery({
        queryKey: [
            "workout-calendar",
            start.toISOString(),
            end.toISOString(),
        ],
        queryFn: () => getWorkoutCalendarDatesQueryFn(start, end),
    });
}

export function useStreakQuery() {
    return useQuery({
        queryKey: ["streak"],
        queryFn: getStreakQueryFn,
    });
}
