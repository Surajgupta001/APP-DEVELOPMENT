import { useUser } from "@clerk/expo";
import { useSupabase } from "../useSupabase";
import { useQuery } from "@tanstack/react-query";
import { querykeys } from "../../lib/query/key";
import { getBudgets } from "../../lib/services/budgets";

export function useBudgetQuery() {
    const { user } = useUser();
    const supabase = useSupabase();

    return useQuery({
        queryKey: querykeys.budget(user?.id!),
        queryFn: () => getBudgets(supabase, user!.id),
        enabled: !!user,
    });
};