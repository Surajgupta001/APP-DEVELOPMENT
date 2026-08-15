import type { SupabaseClient } from "@supabase/supabase-js";
import type { Budget } from "../../types/index";

export async function getBudgets(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching budgets from Supabase:", error);
        throw new Error('Failed to fetch budgets. Please try again.');
    }

    return data as Budget | null;
};

export async function upsertBudget(supabase: SupabaseClient, userId: string, amount: number) {
    const { data, error } = await supabase
        .from('budgets')
        .upsert({
            user_id: userId,
            amount,
        }, {
            onConflict: 'user_id',
        })
        .select('*')
        .single();

    if (error) {
        console.error("Error upserting budget in Supabase:", error);
        throw new Error('Failed to set budget. Please try again.');
    }

    return data as Budget;
};

export async function deleteBudget(supabase: SupabaseClient, userId: string) {
    const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('user_id', userId);

    if (error) {
        console.error("Error deleting budget in Supabase:", error);
        throw new Error('Failed to remove budget. Please try again.');
    }
};