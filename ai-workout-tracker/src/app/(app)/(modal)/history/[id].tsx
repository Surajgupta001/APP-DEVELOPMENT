import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Skeleton from "@/components/ui/skeleton";
import { useHistoryDetailQuery } from "@/hooks/queries";
import { formatDuration, formatSessionDate } from "@/lib/format";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Text } from "react-native";
import { Pressable, ScrollView, View } from "react-native";

export default function SingleHistory() {

    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const mutedForeground = useAppThemeColor("mutedForeground");

    const { data, isError, isPending, refetch } = useHistoryDetailQuery(id);

    if (isPending) return <HistoryDetailSkeleton />;

    if (isError || !data) {
        return (
            <EmptyState
                message="Could not load this history session"
                onRetry={refetch}
            />
        );
    }

    return (
        <SafeAreaScreen edges={["top", "bottom"]}>
            <ScrollView contentContainerClassName="px-5 pb-8">
                <View className="flex-row items-center justify-between h-14">
                    <Pressable
                        className="items-center justify-center -ml-3 h-11 w-11"
                        onPress={router.back}
                    >
                        <Feather color={mutedForeground} name="arrow-left" size={23} />
                    </Pressable>
                    <Feather color={mutedForeground} name="more-horizontal" size={23} />
                </View>

                <Text className="font-inter-bold text-[24px] text-foreground">
                    {data.workoutName}
                </Text>
                <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                    {formatSessionDate(data.completedAt)}
                </Text>

                <View className="flex-row gap-2 my-5">
                    <StatCard
                        label="Duration"
                        value={formatDuration(data.durationSeconds)}
                    />
                    <StatCard label="Sets" value={String(data.setCount)} />
                    <StatCard
                        label="Volume"
                        value={
                            data.volume !== null ? `${data.volume.toLocaleString()} kg` : "-"
                        }
                    />
                </View>

                <View>
                    <Text className="mb-3 text-base font-inter-bold text-foreground">
                        Exercises
                    </Text>
                    <View className="overflow-hidden border rounded-xl border-border bg-card">
                        {data.exercises.map((exercise) => (
                            <View
                                key={exercise.id}
                                className="flex-row items-center px-3 py-2 border-b min-h-20 border-border last:border-b-0"
                            >
                                {exercise.image ? (
                                    <Image
                                        className="w-12 rounded-lg h-11 bg-muted"
                                        resizeMode="cover"
                                        source={{ uri: exercise.image }}
                                    />
                                ) : (
                                    <View className="items-center justify-center w-12 rounded-lg h-11 bg-muted">
                                        <Feather color={mutedForeground} name="image" size={16} />
                                    </View>
                                )}

                                <View className="flex-1 ml-3">
                                    <Text className="font-inter-semibold text-[13px] text-foreground">
                                        {exercise.name}
                                    </Text>

                                    <View className="flex-row flex-wrap gap-1 mt-1">
                                        {exercise.sets.map((set, i) => (
                                            <View
                                                key={i}
                                                className="rounded-md bg-muted px-1.5 py-0.5"
                                            >
                                                <Text className="font-inter text-[10px] text-muted-foreground">
                                                    {(set.weight || 0) ?? "—"}kg × {set.reps}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    <Button
                        className="mt-6"
                        leftIcon={<Feather color="white" name="repeat" size={17} />}
                        onPress={() =>
                            router.push({
                                pathname: "/workout/[id]/active",
                                params: { id: data.workoutId },
                            })
                        }
                        size="sm"
                    >
                        Repeat Workout
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaScreen>
    );
};

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <View className="items-center flex-1 px-2 py-4 border rounded-xl border-border bg-card">
            <Text className="font-inter text-[11px] text-muted-foreground">
                {label}
            </Text>
            <Text className="mt-2 font-inter-bold text-[14px] text-foreground">
                {value}
            </Text>
        </View>
    );
}
function HistoryDetailSkeleton() {
    return (
        <SafeAreaScreen edges={["top", "bottom"]}>
            <View className="flex-1 px-5 pt-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-2/3 mt-5 rounded-lg h-7" />
                <Skeleton className="w-32 h-4 mt-2 rounded-md" />
                <View className="flex-row gap-2 mt-5">
                    <Skeleton className="flex-1 h-20 rounded-xl" />
                    <Skeleton className="flex-1 h-20 rounded-xl" />
                    <Skeleton className="flex-1 h-20 rounded-xl" />
                </View>
                <Skeleton className="w-24 h-5 mt-6 rounded-md" />
                <View className="gap-2 mt-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton className="w-full h-20 rounded-xl" key={index} />
                    ))}
                </View>
            </View>
        </SafeAreaScreen>
    );
}
