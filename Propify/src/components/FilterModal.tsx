import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PropertyType, useFilterStore } from "../../store/filterStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useColorScheme } from "nativewind";

const TYPES: { label: string; value: PropertyType }[] = [
    { label: "All", value: null },
    { label: "Apartment", value: "apartment" },
    { label: "House", value: "house" },
    { label: "Villa", value: "villa" },
    { label: "Studio", value: "studio" },
];

const BEDS = [
    { label: "Any", value: null },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
    { label: "Under ₹50L", min: null, max: 5000000 },
    { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
    { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
    { label: "Above ₹2Cr", min: 20000000, max: null },
];

const chip = (active: boolean, isDark: boolean) => `px-4 py-2 rounded-full border ${active ? "bg-blue-600 border-blue-600" : (isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}`;

const chipText = (active: boolean, isDark: boolean) => `text-sm font-semibold ${active ? "text-white" : (isDark ? "text-gray-300" : "text-gray-600")}`;

export default function FilterModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const { type, bedrooms, minPrice, maxPrice, setType, setBedrooms, setMinPrice, setMaxPrice, resetFilters } = useFilterStore();

    const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
    const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");

    const activeCount = [type, bedrooms, minPrice, maxPrice].filter((v) => v !== null).length;

    const handleApply = () => {
        setMinPrice(localMin ? Number(localMin) : null);
        setMaxPrice(localMax ? Number(localMax) : null);
        onClose();
    };

    const handleReset = () => {
        setLocalMin("");
        setLocalMax("");
        resetFilters();
        onClose();
    };

    const shadow = {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.3 : 0.04,
        shadowRadius: 4,
        elevation: 1,
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-gray-50 dark:bg-[#121212]">
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white dark:bg-[#1E1E1E] border-b border-gray-100 dark:border-zinc-800">
                    <TouchableOpacity onPress={onClose} className="p-1">
                        <Ionicons
                            name="close"
                            size={22}
                            color={isDark ? "#fff" : "#374151"}
                        />
                    </TouchableOpacity>
                    <Text className="text-base font-bold text-gray-800 dark:text-white">
                        Filters
                    </Text>
                    <TouchableOpacity onPress={handleReset} className="p-1">
                        <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Reset
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >

                    {/* Property Type */}
                    <Text className="mb-3 text-base font-bold text-gray-800 dark:text-gray-200">
                        Property Type
                    </Text>
                    <View className="flex-row flex-wrap gap-2 mb-6">
                        {TYPES.map((item) => (
                            <TouchableOpacity
                                key={String(item.value)}
                                onPress={() => setType(item.value)}
                                className={chip(type === item.value, isDark)}
                                style={shadow}
                            >
                                <Text className={chipText(type === item.value, isDark)}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Bedrooms */}
                    <Text className="mb-3 text-base font-bold text-gray-800 dark:text-gray-200">
                        Bedrooms
                    </Text>
                    <View className="flex-row gap-2 mb-6">
                        {BEDS.map((item) => (
                            <TouchableOpacity
                                key={String(item.value)}
                                onPress={() => setBedrooms(item.value)}
                                className={`flex-1 items-center py-3 rounded-2xl border ${bedrooms === item.value
                                    ? "bg-blue-600 border-blue-600"
                                    : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                                    }`}
                                style={shadow}
                            >
                                <Text
                                    className={`text-sm font-bold ${bedrooms === item.value ? "text-white" : "text-gray-600 dark:text-gray-300"
                                        }`}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Price Range */}
                    <Text className="mb-3 text-base font-bold text-gray-800 dark:text-gray-200">
                        Price Range (₹)
                    </Text>
                    <View className="flex-row gap-3 mb-3">
                        {[
                            {
                                label: "Min Price",
                                value: localMin,
                                onChange: setLocalMin,
                                placeholder: "0",
                            },
                            {
                                label: "Max Price",
                                value: localMax,
                                onChange: setLocalMax,
                                placeholder: "Any",
                            },
                        ].map(({ label, value, onChange, placeholder }) => (
                            <View key={label} className="flex-1">
                                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
                                    {label}
                                </Text>
                                <View
                                    className="flex-row items-center px-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl"
                                    style={shadow}
                                >
                                    <Text className="mr-1 text-sm text-gray-400 dark:text-gray-500">₹</Text>
                                    <TextInput
                                        className="flex-1 py-3 text-gray-800 dark:text-white"
                                        placeholder={placeholder}
                                        placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                                        keyboardType="numeric"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Price Presets */}
                    <View className="flex-row flex-wrap gap-2">
                        {PRICE_PRESETS.map((p) => {
                            const active = minPrice === p.min && maxPrice === p.max;
                            return (
                                <TouchableOpacity
                                    key={p.label}
                                    onPress={() => {
                                        setLocalMin(p.min ? String(p.min) : "");
                                        setLocalMax(p.max ? String(p.max) : "");
                                        setMinPrice(p.min);
                                        setMaxPrice(p.max);
                                    }}
                                    className={`px-3 py-1.5 rounded-full border ${active
                                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800"
                                        : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                                        }`}
                                >
                                    <Text
                                        className={`text-xs font-medium ${active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                                            }`}
                                    >
                                        {p.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* Apply Button */}
                <View className="px-5 pt-4 pb-8 bg-white dark:bg-[#1E1E1E] border-t border-gray-100 dark:border-zinc-800">
                    <TouchableOpacity
                        onPress={handleApply}
                        className="items-center py-4 bg-blue-600 rounded-2xl"
                        style={{
                            shadowColor: "#2563EB",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                    >
                        <Text className="text-base font-bold text-white">
                            Apply Filters{activeCount > 0 ? ` (${activeCount})` : ""}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    )
}
