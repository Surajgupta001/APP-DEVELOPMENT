import { getExerciseInstructionsQueryFn } from "@/lib/api";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Modal, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Skeleton from "../ui/skeleton";
import Button from "../ui/button";

type AiCoachModalProps = {
    exercise: {
        description: string;
        id: string;
        instructions?: readonly string[];
        name: string;
    };
    onClose: () => void;
    visible: boolean;
};

export default function AiCoachModal({ exercise, onClose, visible }: AiCoachModalProps) {
    const foreground = useAppThemeColor("foreground");

    const { data, isPending } = useQuery({
        enabled: visible && Boolean(exercise.id),
        queryFn: () => getExerciseInstructionsQueryFn(exercise.id),
        queryKey: ["exercise-instructions", exercise.id],
    });

    const instructions = data?.instructions ?? exercise.instructions ?? [exercise.description];

    return (
        <Modal
            animationType="slide"
            onRequestClose={onClose}
            presentationStyle="overFullScreen"
            statusBarTranslucent
            transparent
            visible={visible}
        >
            <View className="justify-end flex-1 bg-overlay/60">
                <SafeAreaView
                    className="max-h-[86%] rounded-t-[28px] bg-card"
                    edges={["bottom"]}
                >
                    <View className="items-center pt-3">
                        <View className="h-1.5 w-12 rounded-full bg-border" />
                    </View>

                    <ScrollView
                        contentContainerClassName="px-5 pb-4 pt-5"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="flex-row items-center">
                            <View className="items-center justify-center w-12 h-12 rounded-2xl bg-muted">
                                <Feather color={foreground} name="message-circle" size={24} />
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className="font-inter-bold text-[20px] text-foreground">
                                    AI Coach
                                </Text>
                                <Text className="mt-0.5 font-inter text-[12px] text-muted-foreground">
                                    How to perform {exercise.name}
                                </Text>
                            </View>
                        </View>

                        <View className="p-4 mt-5 border rounded-2xl border-border bg-card">
                            <Text className="font-inter-semibold text-[14px] text-foreground">
                                Step-by-step guidance
                            </Text>

                            {isPending ? (
                                <View className="gap-3 mt-4">
                                    <Skeleton className="w-full h-10" />
                                    <Skeleton className="w-full h-10" />
                                    <Skeleton className="w-full h-10" />
                                </View>
                            ) : (
                                <View className="gap-4 mt-4">
                                    {instructions.map((instruction, index) => (
                                        <View
                                            className="flex-row"
                                            key={`${index}-${instruction.slice(0, 15)}`}
                                        >
                                            <View className="items-center justify-center rounded-full h-7 w-7 bg-secondary">
                                                <Text className="font-inter-semibold text-[12px] text-secondary-foreground">
                                                    {index + 1}
                                                </Text>
                                            </View>
                                            <Text className="ml-3 flex-1 font-inter text-[13px] leading-5 text-foreground">
                                                {instruction}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View className="flex-row p-4 mt-4 rounded-2xl bg-muted">
                            <Feather color={foreground} name="info" size={20} />
                            <Text className="ml-3 flex-1 font-inter text-[12px] leading-5 text-muted-foreground">
                                Use a manageable weight and controlled range of motion. Stop if
                                you feel sharp pain. This is general fitness guidance, not
                                medical advice.
                            </Text>
                        </View>
                    </ScrollView>

                    <View className="px-5 pt-3 pb-2 border-t border-border">
                        <Button
                            accessibilityLabel="Close AI Coach"
                            onPress={onClose}
                            variant="secondary"
                        >
                            Got It
                        </Button>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}
