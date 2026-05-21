import { COLORS } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Constants from "expo-constants";

const isExpoGo = Constants.appOwnership === "expo";

export default function ListEmptyComponent() {
    return (
        <View className="items-center gap-2 pt-20 px-5">
            <Ionicons name="people-outline" size={48} color={COLORS.textSubtle} />
            <Text className="text-[17px] font-semibold text-foreground text-center">No users found</Text>
            {isExpoGo && (
                <Text className="text-sm text-center text-foreground-muted mt-1 opacity-70">
                    Explore features require a development build. Run `npx expo run:android` to connect with real users.
                </Text>
            )}
        </View>
    );
}