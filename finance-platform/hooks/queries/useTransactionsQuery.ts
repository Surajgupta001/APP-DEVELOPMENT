import { useUser } from "@clerk/expo";
import { useSupabase } from "../useSupabase";
import { Transactionfilter } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { querykeys } from "../../lib/query/key";
import { getTransactions } from "../../lib/services/transactions";

export function useTransactionsQuery(filters: Transactionfilter = {}) {
    const { user } = useUser();
    const supabase = useSupabase();

    return useQuery({
        queryKey: querykeys.transactions(user?.id!, filters),
        queryFn: () => getTransactions(supabase, user!.id, filters),
        enabled: !!user,
    });
};