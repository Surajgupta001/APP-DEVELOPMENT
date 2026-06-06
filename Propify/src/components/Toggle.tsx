import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface ToggleProps {
    label: string;
    description: string;
    value: boolean;
    onChange: (v: boolean) => void;
};

export function Toggle({ label, description, value, onChange }: ToggleProps) {
    return (
        <TouchableOpacity
            onPress={() => onChange(!value)}
            className={`flex-row justify-between items-center p-4 rounded-2xl border ${value ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"}`}
        >
            <View className='flex-1 mr-3'>
                <Text className={`text-sm font-semibold ${value ? "text-white" : "text-gray-800"}`}>
                    {label}
                </Text>
                {description && (<Text className='text-xs text-gray-400 mt-0.5'>{description}</Text>)}
            </View>
            <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${value ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
            >
                {value && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
        </TouchableOpacity>
    );
};