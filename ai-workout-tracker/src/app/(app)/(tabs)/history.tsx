import { View, Text, FlatList, Pressable, Image } from 'react-native'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { getHistoryQueryFn, HistorySessionItem } from '@/lib/api';
import { useRouter } from 'expo-router';
import { isSameDay, startOfDay } from 'date-fns';
import SafeAreaScreen from '@/components/ui/safe-area-screen';
import EmptyState from '@/components/ui/empty-state';
import WeekCalendar from '@/components/week-calendar';
import Skeleton from '@/components/ui/skeleton';
import { useAppThemeColor } from '@/theme/app-theme';
import { Feather } from '@expo/vector-icons';
import { formatDuration, formatSessionDate } from '@/lib/format';

export default function History() {

    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const {
        data = [],
        isError,
        isPending,
        refetch,
    } = useQuery({
        queryKey: ["history"],
        queryFn: () => getHistoryQueryFn(),
    });

    const filtered = selectedDate ? data.filter((item) => isSameDay(new Date(item.completedAt), selectedDate)) : data;

    const workoutDates = data.map((item) => new Date(item.completedAt));

    const totalSeconds = filtered.reduce(
        (sum, item) => sum + item.durationSeconds,
        0,
    );

    return (
        <SafeAreaScreen edges={["top", "bottom"]}>
            <FlatList
                data={isPending ? [] : filtered}
                contentContainerClassName="px-5 pb-6"
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View className="h-3" />}
                ListEmptyComponent={
                    isPending ? (
                        <HistorySkeleton />
                    ) : isError ? (
                        <EmptyState message="Could not load history" onRetry={refetch} />
                    ) : (
                        <EmptyState
                            icon="calendar"
                            message={
                                selectedDate
                                    ? "No workouts on this day"
                                    : "No workouts yet. Complete a workout"
                            }
                        />
                    )
                }
                ListHeaderComponent={
                    <View>
                        <Text className="pt-3 text-2xl font-inter-bold text-foreground">
                            History
                        </Text>
                        <View>
                            {/* {Weekly calendar} */}
                            <WeekCalendar
                                markedDates={workoutDates}
                                onChange={setSelectedDate}
                                value={selectedDate ?? startOfDay(new Date())}
                            />
                        </View>

                        <View className="flex-row gap-3 my-5">
                            {isPending ? (
                                <>
                                    <Skeleton className="flex-1 h-20 rounded-xl" />
                                    <Skeleton className="flex-1 h-20 rounded-xl" />
                                </>
                            ) : (
                                <>
                                    <SummaryCard
                                        label="Workouts"
                                        value={String(filtered.length)}
                                    />

                                    <SummaryCard
                                        label="Total Time"
                                        value={formatDuration(totalSeconds)}
                                    />
                                </>
                            )}
                        </View>
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-base font-inter-bold text-foreground">
                                Recent Workouts
                            </Text>
                            {selectedDate && (
                                <Pressable
                                    accessibilityRole="button"
                                    className="rounded-full border border-border bg-card px-3 py-1.5 active:bg-muted"
                                    onPress={() => setSelectedDate(null)}
                                >
                                    <Text className="font-inter-medium text-[11px] text-primary">
                                        Reset
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                }

                renderItem={({ item }) => (
                    <HistoryCard
                        item={item}
                        onPress={() =>
                            router.push({
                                pathname: "/history/[id]",
                                params: { id: item.id },
                            })
                        }
                    />
                )}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaScreen>
    );
};

function HistoryCard({
    item,
    onPress,
}: {
    item: HistorySessionItem;
    onPress: () => void;
}) {
    const muted = useAppThemeColor("mutedForeground");

    return (
        <Pressable
            className="flex-row items-center p-3 border shadow-xs rounded-xl border-border bg-card active:bg-muted"
            onPress={onPress}
        >
            {item.image ? (
                <Image
                    className="w-20 h-16 rounded-lg bg-muted"
                    resizeMode="cover"
                    source={{ uri: item.image }}
                />
            ) : (
                <View className="items-center justify-center w-20 h-16 rounded-lg bg-muted">
                    <Feather color={muted} name="image" size={20} />
                </View>
            )}
            <View className="flex-1 ml-3">
                <Text className="font-inter-semibold text-[14px] text-foreground">
                    {item.workoutName}
                </Text>
                <Text className="mt-1 font-inter text-[11.5px] text-muted-foreground">
                    {formatSessionDate(item.completedAt)}
                </Text>
                <Text className="mt-1 font-inter text-[11.5px] text-muted-foreground">
                    {item.exerciseCount} exercises • {item.setCount} sets •{" "}
                    {formatDuration(item.durationSeconds)}
                </Text>
            </View>
            <Feather color={muted} name="chevron-right" size={20} />
        </Pressable>
    );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
    return (
        <View className="flex-1 p-4 border shadow-xs rounded-xl border-border bg-card">
            <Text className="font-inter text-[12px] text-muted-foreground">
                {label}
            </Text>
            <Text className="mt-2 font-inter-bold text-[20px] text-foreground">
                {value}
            </Text>
        </View>
    );
}

function HistorySkeleton() {
    return (
        <View>
            {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className="w-full h-24 mb-3 rounded-xl" key={index} />
            ))}
        </View>
    );
}
