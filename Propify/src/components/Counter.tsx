import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface CounterProps {
    label: string;
    value: number;
    onChange: (v: number) => void;
};

export function Counter({ label, value, onChange }: CounterProps) {
    return (
        <View className='flex-1'>
            <Text className='text-sm font-semibold text-gray-700 mb-1.5'>{label}</Text>
            <View className='flex-row items-center overflow-hidden bg-white border border-gray-200 rounded-2xl'>
                <TouchableOpacity
                    onPress={() => onChange(Math.max(1, value - 1))}
                    className='items-center justify-center h-11 w-11'
                >
                    <Ionicons name="remove" size={18} color="#9CA3AF" />
                </TouchableOpacity>
                <Text className='flex-1 text-base font-bold text-center text-gray-800'>{value}</Text>
                <TouchableOpacity
                    onPress={() => onChange(value + 1)}
                    className='items-center justify-center h-11 w-11'
                >
                    <Ionicons name="add" size={18} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};