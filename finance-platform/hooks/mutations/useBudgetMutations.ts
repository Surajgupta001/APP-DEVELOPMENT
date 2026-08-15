import { useUser } from "@clerk/expo";
import { useSupabase } from "../useSupabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertBudget, deleteBudget } from "../../lib/services/budgets";
import { querykeys } from "../../lib/query/key";

export function useUpsertBudget() {
    const { user } = useUser();
    const supabase = useSupabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number) => upsertBudget(supabase, user?.id!, amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: querykeys.budget(user?.id!) });
        },
    });
}

export function useDeleteBudget() {
    const { user } = useUser();
    const supabase = useSupabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteBudget(supabase, user?.id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: querykeys.budget(user?.id!) });
        },
    });
}