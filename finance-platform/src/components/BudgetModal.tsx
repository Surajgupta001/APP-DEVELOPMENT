import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Budget } from '../../types';
import FormSheetModal from './FormSheetModal';
import { useEffect, useState } from 'react';
import { useUpsertBudget } from '../../hooks/mutations/useBudgetMutations';
import { COLORS } from '../../constants/theme';

interface BudgetModalProps {
    visible: boolean;
    budget: Budget | null;
    onClose: () => void;
    onSaved: () => void;
};

export default function BudgetModal({ visible, budget, onClose, onSaved }: BudgetModalProps) {

    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const { mutateAsync: upsertBudget, isPending: saving } = useUpsertBudget();

    useEffect(() => {
        if (visible) {
            setAmount(budget ? String(budget.amount) : '');
            setError('');
        }
    }, [visible, budget]);

    const handleSave = async () => {
        const parsedAmount = parseFloat(amount.replace(/,/g, ''));

        if (!parsedAmount || parsedAmount <= 0) {
            setError('Please enter a valid monthly budget amount');
            return;
        }

        setError('');
        try {
            await upsertBudget(parsedAmount);
            onSaved();
        } catch (error) {
            console.error('Error saving budget:', error);
            setError('An error occurred while saving the budget. Please try again.');
        }
    };

    return (
        <FormSheetModal
            visible={visible}
            title={budget ? "Edit monthly budget" : "Set monthly budget"}
            onClose={onClose}
        >
            <Text className="text-brand-bg text-xs font-medium mb-1.5">
                Monthly budget
            </Text>
            <TextInput
                value={amount}
                onChangeText={(v) => {
                    setError("");
                    setAmount(v);
                }}
                placeholder="e.g. 50000"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="numeric"
                autoFocus
                className="bg-white border border-[#E8E6DF] rounded-xl px-4 py-3.5 mb-5 text-sm text-brand-bg"
            />

            {error ? (
                <Text className="mb-3 text-xs text-brand-coral">{error}</Text>
            ) : null}

            <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                className="items-center py-4 mb-3 bg-brand-bg rounded-xl"
                activeOpacity={0.85}
            >
                <Text className="text-sm font-semibold text-white">
                    {saving ? "Saving…" : "Save budget"}
                </Text>
            </TouchableOpacity>
        </FormSheetModal>
    );
}