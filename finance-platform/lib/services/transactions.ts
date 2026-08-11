import type { SupabaseClient } from "@supabase/supabase-js";
import type { Transaction, Transactionfilter } from "../../types/index";

export async function getTransactions(supabase: SupabaseClient, userId: string, filter: Transactionfilter = {}) {
    let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);

    if (filter.type) {
        query = query.eq('type', filter.type);
    }
    if (filter.accountId) {
        query = query.eq('account_id', filter.accountId);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
        console.error("Error fetching transactions from Supabase:", error);
        throw new Error('Failed to fetch transactions. Please try again.');
    }

    return data as Transaction[]
};