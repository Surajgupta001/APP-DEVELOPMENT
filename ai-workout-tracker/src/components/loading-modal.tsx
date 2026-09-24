import { ActivityIndicator, Modal, Text, View } from "react-native";
import { useAppThemeColor } from "@/theme/app-theme";

export default function LoadingModal({
    message = "Loading...",
    visible,
}: {
    message?: string;
    visible: boolean;
}) {
    const primary = useAppThemeColor("primary");

    return (
        <Modal
            animationType="fade"
            statusBarTranslucent
            transparent
            visible={visible}
        >
            <View className="items-center justify-center flex-1 bg-overlay/40">
                <View className="items-center p-5 w-44 rounded-2xl bg-card">
                    <ActivityIndicator color={primary} />
                    <Text className="mt-3 font-inter-medium text-[13px] text-foreground">
                        {message}
                    </Text>
                </View>
            </View>
        </Modal>
    );
}