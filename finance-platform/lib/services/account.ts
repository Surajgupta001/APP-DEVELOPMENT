import type { SupabaseClient } from "@supabase/supabase-js";
import type { Account, AccountType } from "../../types/index";

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
};

export async function createAccount(supabase: SupabaseClient, userId: string, { name, type }: { name: string; type: AccountType }) {
    const { data, error } = await supabase
        .from('accounts')
        .insert({ user_id: userId, name, type, balance: 0, is_default: false })
        .select()
        .single();

    if (error) {
        console.error("Error creating account in Supabase:", error);
        throw new Error('Failed to create account. Please try again.');
    }

    return data as Account;
};

export async function setDefaultAccount(supabase: SupabaseClient, userId: string, accountId: string) {
    const { error: unsetError } = await supabase
        .from('accounts')
        .update({ is_default: false })
        .eq('user_id', userId)
        .neq('id', accountId);

    if (unsetError) {
        console.error("Error unsetting default account in Supabase:", unsetError);
        throw new Error('Failed to set default account. Please try again.');
    }

    const { error: setError } = await supabase
        .from('accounts')
        .update({ is_default: true })
        .eq('id', accountId);

    if (setError) {
        console.error("Error setting default account in Supabase:", setError);
        throw new Error('Failed to set default account. Please try again.');
    }
};

export async function updateAccount(supabase: SupabaseClient, accountId: string, { name, type }: { name: string; type: AccountType }) {
    const { data, error } = await supabase
        .from('accounts')
        .update({ name, type })
        .eq('id', accountId)
        .select()
        .single();

    if (error) {
        console.error("Error updating account in Supabase:", error);
        throw new Error('Failed to update account. Please try again.');
    }

    return data as Account;
};

export async function deleteAccount(supabase: SupabaseClient, accountId: string, { force = false }: { force?: boolean }) {
    const { count, error: countError } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', accountId);

    if (countError) {
        console.error("Error counting transactions for account in Supabase:", countError);
        throw new Error('Failed to check transactions for account. Please try again.');
    }

    const transactionCount = count ?? 0;

    if (transactionCount > 0 && !force) {
        return { deleted: false, transactionCount };
    }

    const { error: deleteError } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId);

    if (deleteError) {
        console.error("Error deleting account in Supabase:", deleteError);
        throw new Error('Failed to delete account. Please try again.');
    }
};