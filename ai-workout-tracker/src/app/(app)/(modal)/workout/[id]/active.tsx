import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ActiveWorkoutModal() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const muted = useAppThemeColor("mutedForeground");

    return (
        <SafeAreaScreen edges={["top", "bottom"]}>
            <View className="flex-1 px-5">
                <View className="flex-row items-center justify-between h-14">
                    <Pressable
                        className="items-center justify-center h-11 w-11"
                        onPress={router.back}
                    >
                        <Feather name="x" size={23} color={muted} />
                    </Pressable>
                    <Text className="font-inter-bold text-[17px] text-foreground">
                        Active Workout
                    </Text>
                    <View className="h-11 w-11" />
                </View>

                <View className="items-center justify-center flex-1">
                    <Text className="font-inter-medium text-[15px] text-muted-foreground">
                        Workout Session: {id}
                    </Text>
                </View>
            </View>
        </SafeAreaScreen>
    );
}
