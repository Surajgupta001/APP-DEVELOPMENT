import { useUser } from "@clerk/expo";
import { useSupabase } from "../useSupabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertBudget } from "../../lib/services/budgets";

export function useUpsertBudget() {
    const { user } = useUser();
    const supabase = useSupabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number) => upsertBudget(supabase, user?.id!, amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
}