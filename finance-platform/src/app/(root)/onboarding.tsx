import { Controller, useForm } from 'react-hook-form'
import { View, Text, KeyboardAvoidingView, Platform, Image, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { OnboardingData, onboardingSchema } from '../../../lib/schemas/onboarding'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { ALL_CURRENCIES, CurrencyPicker } from '@/components/currencyPicker'
import { Feather } from '@expo/vector-icons'

export default function OnboardingScreen() {

    const {
        control,
        handleSubmit,
        formState: { errors: formErrors },
    } = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema),
        mode: 'onBlur',
        defaultValues: { startingBalance: '' }
    });

    const [selectedCurrency, setSelectedCurrency] = useState(
        ALL_CURRENCIES().find((c) => c.code === "INR") ?? ALL_CURRENCIES()[0]
    );

    const [pickerOpen, setPickerOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async ({ startingBalance }: OnboardingData) => {
        // Implementation for saving onboarding data
    };

    return (
        <SafeAreaView className='flex-1 bg-brand-body' edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="justify-center flex-1 px-6 -mt-16">
                    <Image
                        source={require("../../../assets/images/welth.png")}
                        className="mb-10 h-14 w-36"
                        resizeMode="contain"
                    />
                    <Text className="text-[#1A1D26] text-3xl font-bold mb-2">
                        Let&apos;s get you set up
                    </Text>
                    <Text className="mb-10 text-sm text-brand-text-muted">
                        A couple of quick details to personalise your experience.
                    </Text>
                    {/* Starting balance */}
                    <Text className="text-brand-bg text-xs font-medium mb-1.5">
                        Starting balance
                    </Text>
                    <View className="flex-row items-center bg-white border border-[#E8E6DF] rounded-xl px-4 mb-1">
                        <Text className="mr-2 text-sm text-brand-text-secondary">
                            {selectedCurrency.symbol}
                        </Text>
                        <Controller
                            control={control}
                            name="startingBalance"
                            render={({ field: { value, onChange } }) => (
                                <TextInput
                                    value={value}
                                    onChangeText={(v) => {
                                        setError("");
                                        onChange(v);
                                    }}
                                    placeholder="e.g. 50000"
                                    placeholderTextColor="#8A8D96"
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    className="flex-1 py-3.5 text-sm text-brand-bg"
                                />
                            )}
                        />
                    </View>
                    {formErrors.startingBalance && (
                        <Text className="mb-4 text-xs text-brand-coral">
                            {formErrors.startingBalance.message}
                        </Text>
                    )}
                    <View className="mb-4" />
                    {/* Currency picker */}
                    <Text className="text-brand-bg text-xs font-medium mb-1.5">
                        Currency
                    </Text>
                    <TouchableOpacity
                        onPress={() => setPickerOpen(true)}
                        className="flex-row items-center justify-between bg-white border border-[#E8E6DF] rounded-xl px-4 py-3.5 mb-6"
                    >
                        <Text className="text-sm text-brand-bg">
                            {selectedCurrency.symbol} {selectedCurrency.code} —{" "}
                            {selectedCurrency.name}
                        </Text>
                        <Feather name="chevron-down" size={16} color="#8A8D96" />
                    </TouchableOpacity>
                    {error ? (
                        <Text className="mb-4 text-xs text-brand-coral">{error}</Text>
                    ) : null}
                    <TouchableOpacity
                        onPress={handleSubmit(handleSave)}
                        disabled={saving}
                        className="items-center py-4 bg-brand-bg rounded-xl"
                        activeOpacity={0.85}
                    >
                        <Text className="text-sm font-semibold text-white">
                            {saving ? "Saving…" : "Get started"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <CurrencyPicker
                visible={pickerOpen}
                selectedCode={selectedCurrency.code}
                onSelect={(currency) => {
                    setSelectedCurrency(currency);
                    setPickerOpen(false);
                }}
                onClose={() => setPickerOpen(false)}
            />
        </SafeAreaView>
    )
}