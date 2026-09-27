import { getHistoryDetailQueryFn, getHistoryQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useHistoryQuery(limit?: number) {
    return useQuery({
        queryKey: ["history", { limit }],
        queryFn: () => getHistoryQueryFn(limit),
    });
}

export function useHistoryDetailQuery(id: string) {
    return useQuery({
        queryKey: ["history", id],
        queryFn: () => getHistoryDetailQueryFn(id),
        enabled: Boolean(id),
    });
}
