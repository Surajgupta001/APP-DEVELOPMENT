import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import { Account, AccountType } from '../../types';
import { useEffect, useState } from 'react';
import { useCreateAccount, useDeleteAccount, useUpdateAccount } from '../../hooks/mutations/useAccountMutation';
import FormSheetModal from './FormSheetModal';
import { COLORS } from '../../constants/theme';

const ACCOUNT_TYPES: AccountType[] = ["CASH", "BANK", "CREDIT_CARD", "SAVINGS"];

const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
    CASH: "Cash",
    BANK: "Bank",
    CREDIT_CARD: "Credit card",
    SAVINGS: "Savings",
};

interface AccountModalProps {
    visible: boolean;
    account: Account | null;
    onClose: () => void;
    onSaved: () => void;
    onDeleted: () => void;
    onMadeDefault: () => void;
    settingDefault?: boolean;
};

export default function AccountModal({ visible, account, onClose, onSaved, onDeleted, onMadeDefault, settingDefault }: AccountModalProps) {

    const isEditing = !!account;

    const [name, setName] = useState('');
    const [type, setType] = useState<AccountType>('CASH');
    const [error, setError] = useState('');

    const { mutateAsync: createAccount, isPending: creating } = useCreateAccount();
    const { mutateAsync: updateAccount, isPending: updating } = useUpdateAccount();
    const { mutateAsync: deleteAccount } = useDeleteAccount();

    const saving = creating || updating;

    useEffect(() => {
        if (visible) {
            setName(account?.name ?? "");
            setType(account?.type ?? "CASH");
            setError("");
        }
    }, [visible, account]);

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Please enter a name for the account.");
            return;
        }
        setError("");

        try {
            if (isEditing) {
                await updateAccount({
                    accountId: account.id,
                    payload: {
                        name: name.trim(),
                        type,
                    }
                })
            } else {
                await createAccount({
                    name: name.trim(),
                    type,
                });
            }
        } catch (error) {
            console.error("Error saving account:", error);
            setError("There was an error saving the account. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!account) return;

        try {
            const result = await deleteAccount({ accountId: account.id });
            if (result?.deleted) {
                onDeleted();
                return;
            }

            Alert.alert(
                'Delete Account',
                `This account has ${result?.transactionCount} transaction${(result?.transactionCount ?? 0) === 1 ? "" : "s"}. Deleting it will also remove all associated transactions. This action cannot be undone. Are you sure?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await deleteAccount({ accountId: account.id, force: true });
                                onDeleted();
                            } catch (error) {
                                console.error("Error deleting account:", error);
                                Alert.alert("Error", "There was an error deleting the account. Please try again.");
                            }
                        },
                    }
                ]
            )
        } catch (error) {
            console.error("Error deleting account:", error);
            Alert.alert("Error", "There was an error deleting the account. Please try again.");
        }
    };

    return (
        <FormSheetModal
            visible={visible}
            title={isEditing ? "Edit account" : "Add account"}
            onClose={onClose}
        >
            <Text className="text-brand-bg text-xs font-medium mb-1.5">Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. HDFC Savings"
                placeholderTextColor={COLORS.placeholder}
                className="bg-white border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-sm text-brand-bg mb-5"
            />

            <Text className="text-brand-bg text-xs font-medium mb-1.5">Type</Text>
            <View className="flex-row flex-wrap gap-2 mb-5">
                {ACCOUNT_TYPES.map((t) => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => setType(t)}
                        className={`px-3.5 py-2 rounded-full border ${type === t
                            ? "bg-brand-bg border-brand-bg"
                            : "bg-white border-[#E8E6DF]"
                            }`}
                    >
                        <Text
                            className={`text-xs font-medium ${type === t ? "text-white" : "text-brand-bg"
                                }`}
                        >
                            {ACCOUNT_TYPE_LABEL[t]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

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
                    {saving ? "Saving…" : isEditing ? "Save changes" : "Add account"}
                </Text>
            </TouchableOpacity>

            {isEditing && !account.is_default && (
                <TouchableOpacity onPress={onMadeDefault} disabled={settingDefault} className="items-center py-3">
                    {settingDefault ? (
                        <ActivityIndicator size="small" color="#4A9EFF" />
                    ) : (
                        <Text className="text-sm font-medium text-brand-blue">
                            Make default
                        </Text>
                    )}
                </TouchableOpacity>
            )}

            {isEditing && (
                <TouchableOpacity onPress={handleDelete} className="items-center py-3">
                    <Text className="text-sm font-medium text-brand-coral">
                        Delete account
                    </Text>
                </TouchableOpacity>
            )}
        </FormSheetModal>
    );
};