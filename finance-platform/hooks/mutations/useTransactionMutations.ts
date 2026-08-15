import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "../useSupabase";
import { useUser } from "@clerk/expo";
import { NewTransaction, Transaction, TransactionType } from "../../types";
import { createTransaction, deleteTransaction } from "../../lib/services/transactions";
import { querykeys } from "../../lib/query/key";

export function useDeleteTransaction() {
    const { user } = useUser();
    const supabase = useSupabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tx: Pick<Transaction, 'id' | 'account_id' | 'amount' | 'type'>) => deleteTransaction(
            supabase,
            tx.id,
            tx.account_id,
            tx.amount,
            tx.type as TransactionType
        ),
        onSuccess: (result) => {
            if (result.error) return;
            queryClient.invalidateQueries({ queryKey: querykeys.transactions(user?.id!) });
            queryClient.invalidateQueries({ queryKey: querykeys.accounts(user?.id!) });
        },
    });
};


export function useCreateTransaction() {
    const { user } = useUser();
    const supabase = useSupabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: NewTransaction) => createTransaction(supabase, payload),
        onSuccess: (result) => {
            if (result.error) return;
            queryClient.invalidateQueries({ queryKey: querykeys.transactions(user?.id!) });
            queryClient.invalidateQueries({ queryKey: querykeys.accounts(user?.id!) });
        },
    });
};