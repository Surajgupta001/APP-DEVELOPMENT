import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import EmptyState from "@/components/ui/empty-state";
import Skeleton from "@/components/ui/skeleton";
import { useHistoryQuery } from "@/hooks/queries";
import { formatDuration, formatSessionDate } from "@/lib/format";
import { useAppThemeColor } from "@/theme/app-theme";
import HomeSectionHeader from "./home-section-header";

export default function RecentWorkout() {
    const router = useRouter();
    const muted = useAppThemeColor("mutedForeground");
    const { data, isPending } = useHistoryQuery(1);
    const recent = data?.[0];

    return (
        <View className="mt-5">
            <HomeSectionHeader
                onViewAll={() => router.push("/history")}
                title="Recent Workout"
            />

            {isPending ? (
                <Skeleton className="min-h-[88px] w-full rounded-xl shadow-xs" />
            ) : !recent ? (
                <EmptyState icon="clock" message="No recent workouts yet." />
            ) : (
                <Pressable
                    className="min-h-[88px] flex-row items-center rounded-xl border border-border bg-card p-3 shadow-xs active:opacity-85"
                    onPress={() =>
                        router.push({
                            pathname: "/(app)/(modal)/history/[id]",
                            params: { id: recent.id },
                        })
                    }
                >
                    {recent.image ? (
                        <Image
                            className="w-20 h-16 rounded-lg bg-muted"
                            resizeMode="cover"
                            source={{ uri: recent.image }}
                        />
                    ) : (
                        <View className="items-center justify-center w-20 h-16 rounded-lg bg-muted">
                            <Feather color={muted} name="image" size={20} />
                        </View>
                    )}
                    <View className="flex-1 ml-3">
                        <Text className="font-inter-semibold text-[14px] text-foreground">
                            {recent.workoutName}
                        </Text>
                        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                            {formatSessionDate(recent.completedAt)}
                        </Text>
                        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                            {recent.exerciseCount} Exercises • {recent.setCount} Sets •{" "}
                            {formatDuration(recent.durationSeconds)}
                        </Text>
                    </View>
                    <Feather color={muted} name="chevron-right" size={22} />
                </Pressable>
            )}
        </View>
    );
}