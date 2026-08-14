import { View, Text, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { useEffect, useState } from 'react'
import { TransactionFormValues, transactionSchema } from '../../../../lib/schemas/transactions';
import { Account, InputMethod } from '../../../../types';
import { useUser } from '@clerk/expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCreateTransaction } from '../../../../hooks/mutations/useTransactionMutations';
import { useAccountQuery } from '../../../../hooks/queries/useAccountsQuery';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../../../constants/categories';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AIActionCard from '@/components/AIActionCard';
import { AI_GRADIENT, AI_GRADIENT_REVERSE } from '../../../../constants/theme';
import PillGroup from '@/components/PillGroup';
import { format, set } from 'date-fns';
import CalendarPicker from '@/components/CalendarPicker';

const TYPE_OPTIONS = [
    { key: "EXPENSE" as const, label: "Expense" },
    { key: "INCOME" as const, label: "Income" },
];

const DEFAULT_VALUES = (accounts: Account[]): TransactionFormValues => ({
    type: "EXPENSE",
    amount: "",
    category: "food",
    accountId: accounts[0]?.id ?? "",
    description: "",
    date: new Date(),
});

export default function AddTransactionScreen() {

    const { user } = useUser();

    const router = useRouter();
    const params = useLocalSearchParams<{ action?: string }>();

    const {
        data: accounts = [],
        isLoading: loadingAccounts,
        isError: accountsError,
    } = useAccountQuery();

    const { mutateAsync: createTransaction, isPending: saving } = useCreateTransaction();

    const [error, setError] = useState("");
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [inputMethod, setInputMethod] = useState<InputMethod>("MANUAL");
    const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [scannerOpen, setScannerOpen] = useState(false);
    const [voiceModalOpen, setVoiceModalOpen] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset: resetForm,
        formState: { errors },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        mode: "onBlur",
        defaultValues: DEFAULT_VALUES([]),
    });

    const type = watch("type");
    const category = watch("category");
    const accountId = watch("accountId");
    const date = watch("date");

    const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    const onSubmit = async (values: TransactionFormValues) => {
        if (!user) return;
        setError("");

        const parsed = parseFloat(values.amount.replace(/,/g, ''));

        const { error: createError } = await createTransaction({
            user_id: user.id,
            account_id: values.accountId,
            type: values.type,
            amount: parsed,
            category: values.category,
            description: values.description?.trim() || null,
            date: values.date.toISOString(),
            input_method: inputMethod,
            voice_transcript: inputMethod === "VOICE" ? voiceTranscript : null,
        });

        if (createError) {
            console.error("Error creating transaction:", createError);
            setError("Failed to save transaction. Please try again.");
            return;
        }

        resetForm(DEFAULT_VALUES(accounts));

        setInputMethod("MANUAL");
        setVoiceTranscript(null);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(root)/(tabs)/transactions");
        }
    };

    useEffect(() => {
        if (accounts.length > 0) {
            resetForm(DEFAULT_VALUES(accounts));
        }
    }, [accounts, resetForm]);

    return (
        <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
            <View className="px-5 pt-3 pb-2">
                <Text className="text-xl font-semibold text-brand-bg">
                    Add transaction
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
                className="flex-1"
            >
                {loadingAccounts ? (
                    <View className="items-center justify-center flex-1">
                        <ActivityIndicator color="#4A9EFF" />
                    </View>
                ) : accountsError ? (
                    <View className="items-center justify-center flex-1 px-10">
                        <Feather name="alert-circle" size={32} color="#FF6B4A" />
                        <Text className="mt-3 text-sm text-center text-brand-text-muted">
                            Couldn&apos;t load your accounts.
                        </Text>
                    </View>
                ) : accounts.length === 0 ? (
                    <View className="items-center justify-center flex-1 px-10">
                        <Feather name="alert-circle" size={32} color="#FF6B4A" />
                        <Text className="mt-3 text-sm text-center text-brand-text-muted">
                            You need an account before adding a transaction.
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            paddingBottom: 100,
                        }}
                    >
                        {/* AI capture shortcuts */}
                        <View className="flex-row gap-2.5 mb-4">
                            <AIActionCard
                                icon="camera"
                                title="Scan receipt"
                                subtitle="Snap a photo"
                                colors={AI_GRADIENT}
                                onPress={() => setScannerOpen(true)}
                            />
                            <AIActionCard
                                icon="mic"
                                title="Voice log"
                                subtitle="Just say it"
                                colors={AI_GRADIENT_REVERSE}
                                onPress={() => setVoiceModalOpen(true)}
                            />
                        </View>

                        {/* Type toggle */}
                        <View className="flex-row bg-white rounded-xl border border-[#E8E6DF] p-1 mb-4">
                            {TYPE_OPTIONS.map((t) => (
                                <TouchableOpacity
                                    key={t.key}
                                    onPress={() => {
                                        setValue("type", t.key);
                                        setValue(
                                            "category",
                                            t.key === "INCOME"
                                                ? INCOME_CATEGORIES[0].key
                                                : EXPENSE_CATEGORIES[0].key
                                        );
                                    }}
                                    className={`flex-1 py-2 rounded-lg items-center ${type === t.key ? "bg-brand-bg" : ""
                                        }`}
                                >
                                    <Text
                                        className={`text-xs font-medium ${type === t.key
                                            ? "text-white"
                                            : "text-brand-text-secondary"
                                            }`}
                                    >
                                        {t.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Amount */}
                        <Text className="text-brand-bg text-xs font-medium mb-1.5">
                            Amount
                        </Text>
                        <Controller
                            control={control}
                            name="amount"
                            render={({ field: { value, onChange, onBlur } }) => (
                                <TextInput
                                    value={value}
                                    onChangeText={(v) => {
                                        setError("");
                                        onChange(v);
                                    }}
                                    onBlur={onBlur}
                                    placeholder="0"
                                    placeholderTextColor="#8A8D96"
                                    keyboardType="numeric"
                                    className="bg-white border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-sm text-brand-bg"
                                />
                            )}
                        />
                        {errors.amount && (
                            <Text className="text-brand-coral text-xs mt-1.5">
                                {errors.amount.message}
                            </Text>
                        )}
                        <View className="mb-4" />

                        {/* Category */}
                        <Text className="text-brand-bg text-xs font-medium mb-1.5">
                            Category
                        </Text>
                        <View className="mb-4">
                            <PillGroup
                                options={categories.map((c) => ({
                                    key: c.key,
                                    label: c.label,
                                    icon: c.icon,
                                }))}
                                value={category}
                                onChange={(key) => setValue("category", key)}
                                scrollable
                            />
                        </View>

                        {/* Account */}
                        <Text className="text-brand-bg text-xs font-medium mb-1.5">
                            Account
                        </Text>
                        <View className="mb-1">
                            <PillGroup
                                options={accounts.map((a) => ({ key: a.id, label: a.name }))}
                                value={accountId}
                                onChange={(key) => setValue("accountId", key)}
                                scrollable
                            />
                        </View>
                        {errors.accountId && (
                            <Text className="mb-3 text-xs text-brand-coral">
                                {errors.accountId.message}
                            </Text>
                        )}
                        <View className="mb-3" />

                        {/* Date */}
                        <Text className="text-brand-bg text-xs font-medium mb-1.5">
                            Date
                        </Text>
                        <TouchableOpacity
                            onPress={() => setDatePickerOpen((v) => !v)}
                            className="flex-row items-center justify-between bg-white border border-[#E8E6DF] rounded-xl px-4 py-3.5 mb-1"
                        >
                            <Text className="text-sm text-brand-bg">
                                {format(date, "d MMM yyyy")}
                            </Text>
                            <Feather name="calendar" size={16} color="#5C5F68" />
                        </TouchableOpacity>

                        {datePickerOpen && (
                            <View className="bg-white border border-[#E8E6DF] rounded-xl mb-4 overflow-hidden">
                                <CalendarPicker
                                    value={date}
                                    maximumDate={new Date()}
                                    onChange={(selectedDate) => {
                                        setValue("date", selectedDate);
                                        setDatePickerOpen(false);
                                    }}
                                />
                            </View>
                        )}
                        {!datePickerOpen && <View className="mb-4" />}

                        {/* Description */}
                        <Text className="text-brand-bg text-xs font-medium mb-1.5">
                            Description (optional)
                        </Text>
                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { value, onChange, onBlur } }) => (
                                <TextInput
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="e.g. Swiggy order"
                                    placeholderTextColor="#8A8D96"
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    className="bg-white border border-[#E8E6DF] rounded-xl px-4 py-3.5 mb-4 text-sm text-brand-bg"
                                />
                            )}
                        />

                        {error ? (
                            <Text className="mb-4 text-xs text-brand-coral">{error}</Text>
                        ) : null}

                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={saving}
                            className="items-center py-4 mb-2 bg-brand-bg rounded-xl"
                            activeOpacity={0.85}
                        >
                            <Text className="text-sm font-semibold text-white">
                                {saving ? "Saving…" : "Save transaction"}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </KeyboardAvoidingView>

            {scanning && (
                <View className="absolute inset-0 items-center justify-center bg-black/40">
                    <View className="items-center px-6 py-5 bg-white rounded-2xl">
                        <ActivityIndicator color="#4A9EFF" />
                        <Text className="mt-3 text-sm text-brand-bg">Reading receipt…</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}