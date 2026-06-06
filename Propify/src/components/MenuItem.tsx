import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
};

export function MenuItem({ icon, label, onPress }: MenuItemProps) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center gap-4 px-4 py-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl"
        >
            <Ionicons name={icon} size={22} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text className="flex-1 text-base font-medium text-gray-700 dark:text-gray-200">
                {label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={isDark ? "#4B5563" : "#D1D5DB"} />
        </TouchableOpacity>
    );
};