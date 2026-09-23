import { FlatList, Image, Pressable, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState, } from 'react'
import { useRouter } from 'expo-router';
import { useWorkoutDraft } from '@/contexts/workout-draft-context';
import { useAppThemeColor } from '@/theme/app-theme';
import { useDebounce } from '@/hooks/use-debounce';
import { useQuery } from '@tanstack/react-query';
import SafeAreaScreen from '@/components/ui/safe-area-screen';
import Skeleton from '@/components/ui/skeleton';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/ui/button';
import { ExerciseItem, getExercisesQueryFn } from '@/lib/api';

export default function Index() {

    const router = useRouter();
    const [query, setQuery] = useState("");
    const search = useDebounce<string>(query);

    const muted = useAppThemeColor("mutedForeground");
    const primary = useAppThemeColor("primary");

    const [selectedExercises, setSelectedExercises] = useWorkoutDraft();

    const {
        data: exercises = [],
        isError,
        isPending,
        isRefetching,
        refetch
    } = useQuery({
        queryKey: ['exercises', search],
        queryFn: () => {
            return getExercisesQueryFn(search);
        },
    });

    const toggleExercise = (exercise: ExerciseItem) => {
        setSelectedExercises((prev) => prev.some(({ id }) => id === exercise.id) ? prev.filter(({ id }) => id !== exercise.id) : [...prev, {
            ...exercise,
            reps: 10,
            sets: 3,
            rest: 90,
        }]);
    }

    return (
        <SafeAreaScreen edges={["top", "bottom"]}>
            <FlatList
                data={exercises}
                contentContainerClassName="px-5 pb-8 pt-0"
                keyboardShouldPersistTaps="handled"
                keyExtractor={({ id }) => id}
                ListEmptyComponent={
                    isPending ? (
                        <View>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <View
                                    key={index}
                                    className="h-[72px] flex-row items-center border-b border-border"
                                >
                                    <Skeleton className="h-12 rounded-lg w-14" />
                                    <View className="flex-1 gap-2 ml-3">
                                        <Skeleton className="h-3.5 w-2/3" />
                                        <Skeleton className="w-1/2 h-3" />
                                    </View>
                                    <Skeleton className="w-5 h-5 rounded-full" />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="items-center py-16">
                            <Feather
                                color={muted}
                                name={isError ? "wifi-off" : "activity"}
                                size={27}
                            />
                            <Text className="mt-3 font-inter text-[13px] text-muted-foreground">
                                {isError ? "Could not load exercises" : "No exercises found"}
                            </Text>
                            {isError && (
                                <Button className="mt-3" onPress={() => refetch()}>
                                    Try Again
                                </Button>
                            )}
                        </View>
                    )
                }
                ListHeaderComponent={
                    <View>
                        <View className="flex-row items-center justify-between h-14">
                            <Pressable
                                className="items-center justify-center h-11 w-11"
                                onPress={router.back}
                            >
                                <Feather name="arrow-left" size={23} color={muted} />
                            </Pressable>
                            <Text className="font-inter-bold text-[17px] text-foreground">
                                Add Exercises
                            </Text>
                            <Pressable
                                className="items-center justify-center h-11 w-11"
                                onPress={router.back}
                            >
                                <Text className="ont-inter-bold text-[13px] text-primary">
                                    Done
                                </Text>
                            </Pressable>
                        </View>
                        <View className="flex-row items-center h-12 px-4 mt-3 mb-3 rounded-xl bg-muted">
                            <Feather color={muted} name="search" size={18} />
                            <TextInput
                                accessibilityLabel="Search exercises"
                                className="ml-3 flex-1 font-inter text-[13px] text-foreground"
                                value={query}
                                onChangeText={setQuery}
                                placeholder="Search exercises..."
                                placeholderTextColor={muted}
                                selectionColor={primary}
                            />
                        </View>
                        <Text className="mb-2 font-inter text-[12px] text-muted-foreground">
                            {selectedExercises.length} selected
                        </Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const isSelected = selectedExercises.some(({ id }) => id === item.id);
                    return (
                        <View className="min-h-[72px] flex-row items-center border-b border-border">
                            <TouchableOpacity
                                className="flex-row items-center flex-1"
                                onPress={() =>
                                    router.push({
                                        pathname: "/workout/exercises/[id]",
                                        params: { id: item.id },
                                    })
                                }
                            >
                                {item.image ? (
                                    <View className="h-[60px] w-[70px] rounded-lg bg-muted">
                                        <Image
                                            className="w-full h-full rounded-lg"
                                            source={{ uri: item.image }}
                                        />
                                    </View>
                                ) : (
                                    <View className="items-center justify-center h-12 rounded-lg w-14 bg-muted">
                                        <Feather color={muted} name="image" size={18} />
                                    </View>
                                )}

                                <View className="flex-1 ml-3">
                                    <Text className="font-inter-semibold text-[13px] text-foreground">
                                        {item.name}
                                    </Text>
                                    <Text className="mt-1 font-inter text-[11.5px] capitalize text-muted-foreground">
                                        {item.muscles} • View details
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <Pressable
                                className="items-end justify-center h-11 w-11"
                                onPress={() => toggleExercise(item)}
                            >
                                <Feather
                                    color={isSelected ? primary : muted}
                                    name={isSelected ? "check-circle" : "circle"}
                                    size={22}
                                />
                            </Pressable>
                        </View>
                    );
                }}

                refreshControl={
                    <RefreshControl
                        colors={[primary]}
                        tintColor={primary}
                        onRefresh={() => refetch()}
                        refreshing={isRefetching}
                    />
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaScreen>
    );
}