import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "nativewind";

interface CounterProps {
    label: string;
    value: number;
    onChange: (v: number) => void;
};

export function Counter({ label, value, onChange }: CounterProps) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View className='flex-1'>
            <Text className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5'>{label}</Text>
            <View className='flex-row items-center overflow-hidden bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl'>
                <TouchableOpacity
                    onPress={() => onChange(Math.max(1, value - 1))}
                    className='items-center justify-center h-11 w-11'
                >
                    <Ionicons name="remove" size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
                </TouchableOpacity>
                <Text className='flex-1 text-base font-bold text-center text-gray-800 dark:text-white'>{value}</Text>
                <TouchableOpacity
                    onPress={() => onChange(value + 1)}
                    className='items-center justify-center h-11 w-11'
                >
                    <Ionicons name="add" size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};