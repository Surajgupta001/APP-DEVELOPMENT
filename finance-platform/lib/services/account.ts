import type { SupabaseClient } from "@supabase/supabase-js";
import type { Account } from "../../types/index";

export async function getAccounts(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching accounts from Supabase:", error);
        throw new Error('Failed to fetch accounts. Please try again.');
    }

    return data as Account[];
}