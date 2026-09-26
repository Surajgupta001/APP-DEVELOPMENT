import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Skeleton from "@/components/ui/skeleton";
import { getWorkoutQueryFn } from "@/lib/api";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const mutedForeground = useAppThemeColor("mutedForeground");

    const {
        data: workout,
        isError,
        isPending,
        refetch,
    } = useQuery({
        queryKey: ["workout", id],
        queryFn: () => getWorkoutQueryFn(id),
        enabled: Boolean(id),
    });

    const exercises = workout?.exercises ?? [];
    const totalSets = exercises.reduce((sum, exercise) => sum + (exercise.sets ?? 0), 0);

    const stats = [
        { icon: "list", label: `${exercises.length} Exercises` },
        { icon: "layers", label: `${totalSets} Sets` },
    ] as const;

    if (isPending) return <WorkoutDetailSkeleton />;

    return (
        <SafeAreaScreen edges={["bottom"]}>
            <ScrollView
                className="flex-1"
                contentContainerClassName="pb-8"
                showsVerticalScrollIndicator={false}
            >
                <View className="h-80 bg-muted">
                    {workout?.image ? (
                        <>
                            <Image
                                className="w-full h-full"
                                resizeMode="cover"
                                source={{ uri: workout.image }}
                            />
                            <View className="absolute inset-0 bg-black/20" />
                        </>
                    ) : (
                        <View className="items-center justify-center h-full bg-muted">
                            <Feather color={mutedForeground} name="image" size={40} />
                        </View>
                    )}
                </View>

                <SafeAreaView className="absolute inset-x-0 top-0" edges={["top"]}>
                    <View className="flex-row items-center justify-between px-4 h-14">
                        <Pressable
                            className="items-center justify-center rounded-full h-11 w-11 bg-black/40 active:opacity-70"
                            onPress={router.back}
                        >
                            <Feather color="white" name="arrow-left" size={23} />
                        </Pressable>
                        <View className="items-center justify-center rounded-full h-11 w-11 bg-black/40">
                            <Feather color="white" name="more-horizontal" size={23} />
                        </View>
                    </View>
                </SafeAreaView>

                {isError ? (
                    <EmptyState message="Could not load this workout" onRetry={refetch} />
                ) : (
                    <View className="px-5">
                        <Text className="mt-4 font-inter-bold text-[24px] text-foreground">
                            {workout?.name}
                        </Text>
                        {Boolean(workout?.muscles) && (
                            <Text className="mt-1 font-inter capitalize text-[13px] text-muted-foreground">
                                {workout?.muscles}
                            </Text>
                        )}

                        <View className="flex-row gap-5 mt-4">
                            {stats.map((stat) => (
                                <View
                                    className="flex-row items-center gap-1.5"
                                    key={stat.label}
                                >
                                    <Feather color={mutedForeground} name={stat.icon} size={14} />
                                    <Text className="font-inter text-[12px] text-muted-foreground">
                                        {stat.label}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Button
                            className="mt-5"
                            leftIcon={<Feather color="white" name="play" size={17} />}
                            onPress={() =>
                                router.push({
                                    pathname: "/workout/[id]/active",
                                    params: { id },
                                })
                            }
                        >
                            Start Workout
                        </Button>

                        <View>
                            <Text className="mb-3 mt-6 font-inter-bold text-[16px] text-foreground">
                                Exercises
                            </Text>
                            {exercises.length === 0 ? (
                                <EmptyState
                                    icon="activity"
                                    message="No exercises in this workout"
                                />
                            ) : (
                                <View className="overflow-hidden border rounded-xl border-border bg-card">
                                    {exercises.map((exercise, index) => (
                                        <View
                                            className="flex-row items-center h-16 px-4 border-b border-border last:border-b-0"
                                            key={`${exercise.name}-${index}`}
                                        >
                                            <View className="items-center justify-center rounded-lg h-9 w-9 bg-muted">
                                                <Text className="font-inter-semibold text-[12px] text-muted-foreground">
                                                    {index + 1}
                                                </Text>
                                            </View>
                                            <View className="flex-1 ml-3">
                                                <Text className="font-inter-semibold text-[13px] text-foreground">
                                                    {exercise.name}
                                                </Text>
                                                <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                                                    {exercise.sets} sets • {exercise.reps} reps •{" "}
                                                    {exercise.rest}s rest
                                                </Text>
                                            </View>
                                            <Feather color={mutedForeground} name="menu" size={17} />
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaScreen>
    );
};

function WorkoutDetailSkeleton() {
    return (
        <ScrollView
            className="flex-1"
            contentInsetAdjustmentBehavior="never"
            contentContainerClassName="pb-8"
            showsVerticalScrollIndicator={false}
        >
            <View className="h-64">
                <Skeleton className="w-full h-full rounded-none" />
                <SafeAreaView className="absolute inset-x-0 top-0" edges={["top"]}>
                    <View className="flex-row items-center justify-between px-4 h-14">
                        <Skeleton className="rounded-full h-11 w-11" />
                        <Skeleton className="rounded-full h-11 w-11" />
                    </View>
                </SafeAreaView>
            </View>

            <View className="px-5">
                <Skeleton className="w-2/3 h-8 mt-4 rounded-lg" />
                <Skeleton className="w-1/2 h-4 mt-2 rounded-md" />
                <View className="flex-row gap-5 mt-4">
                    <Skeleton className="w-20 h-4 rounded-md" />
                    <Skeleton className="w-16 h-4 rounded-md" />
                    <Skeleton className="w-16 h-4 rounded-md" />
                </View>
                <Skeleton className="mt-5 h-14 rounded-xl" />
            </View>
        </ScrollView>
    );
}