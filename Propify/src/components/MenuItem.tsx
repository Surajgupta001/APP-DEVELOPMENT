import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
};

export function MenuItem({ icon, label, onPress }: MenuItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center gap-4 px-4 py-4 bg-gray-50 rounded-2xl"
        >
            <Ionicons name={icon} size={22} color="#6B7280" />
            <Text className="flex-1 text-base font-medium text-gray-700">
                {label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        </TouchableOpacity>
    );
};