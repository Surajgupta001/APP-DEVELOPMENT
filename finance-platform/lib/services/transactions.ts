import { SupabaseClient } from "@supabase/supabase-js";
import type { NewTransaction, Transaction, Transactionfilter, TransactionType } from "../../types/index";

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

export async function deleteTransaction(supabase: SupabaseClient, transactionId: string, accountId: string, amount: number, type: TransactionType) {
    const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

    if (deleteError) {
        console.error("Error deleting transaction from Supabase:", deleteError);
        return {
            success: false,
            message: 'Failed to delete transaction. Please try again.',
            error: deleteError
        }
    }

    const { data: account, error: fetchError } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', accountId)
        .single();

    if (fetchError) {
        console.error("Error fetching account balance from Supabase:", fetchError);
        return {
            success: false,
            message: 'Failed to fetch account balance. Please try again.',
            error: fetchError
        }
    }

    const delta = type === 'INCOME' ? -amount : amount;

    const { error: balanceError } = await supabase
        .from('accounts')
        .update({ balance: account.balance + delta })
        .eq('id', accountId);

    if (balanceError) {
        console.error("Error updating account balance in Supabase:", balanceError);
        return {
            success: false,
            message: 'Failed to update account balance. Please try again.',
            error: balanceError
        }
    }

    return { error: null }
};

export async function createTransaction(supabase: SupabaseClient, payload: NewTransaction) {
    const { data: transaction, error: insertError } = await supabase
        .from('transactions')
        .insert(payload)
        .select()
        .single();

    if (insertError) {
        console.error("Error inserting transaction into Supabase:", insertError);
        return {
            success: false,
            message: 'Failed to create transaction. Please try again.',
            error: insertError
        }
    }

    const { data: account, error: fetchError } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', payload.account_id)
        .single();

    if (fetchError) {
        console.error("Error fetching account balance from Supabase:", fetchError);
        return {
            success: false,
            message: 'Failed to fetch account balance. Please try again.',
            error: fetchError
        }
    }

    const delta = payload.type === 'INCOME' ? payload.amount : -payload.amount;

    const { error: balanceError } = await supabase
        .from('accounts')
        .update({ balance: account.balance + delta })
        .eq('id', payload.account_id);

    if (balanceError) {
        console.error("Error updating account balance in Supabase:", balanceError);
        return {
            success: false,
            message: 'Failed to update account balance. Please try again.',
            error: balanceError
        }
    }

    return {
        transaction: transaction as Transaction,
        error: null
    }
};