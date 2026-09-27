import LoadingModal from "@/components/loading-modal";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Skeleton from "@/components/ui/skeleton";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";
import { useCreateWorkoutSessionMutation } from "@/hooks/mutations";
import { useWorkoutQuery } from "@/hooks/queries";
import { SaveSessionSet, WorkoutDetail, WorkoutExercise } from "@/types";
import { cn } from "@/lib/utils";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatTime = (seconds: number) => {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
}

type Timer = ReturnType<typeof useWorkoutTimer>;

export function ActiveSessionPage() {

    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [completed, setCompleted] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const timer = useWorkoutTimer();

    const valuesRef = useRef<Record<string, { reps?: string; weight?: string }>>({});
    const allowLeave = useRef(false);

    const {
        data: workout,
        isError,
        isPending,
        refetch,
    } = useWorkoutQuery(id);

    const createSessionMutation = useCreateWorkoutSessionMutation();

    const totalSets = (workout?.exercises ?? []).reduce(
        (sum, exercise) => sum + (exercise.sets ?? 0),
        0,
    );

    const saveSession = useCallback(async () => {
        if (!workout) return false;
        setIsSaving(true);

        try {
            const sets: SaveSessionSet[] = [];
            workout.exercises.forEach((exercise) => {
                for (let set = 1; set <= (exercise.sets ?? 0); set++) {
                    const key = `${exercise.id}-${set}`;
                    if (!completed.includes(key)) continue;

                    const values = valuesRef.current[key];
                    const weight = Number(values.weight);
                    sets.push({
                        exerciseId: exercise.id,
                        setNumber: set,
                        reps: parseInt(values?.reps ?? "", 10) || exercise.reps || 0,
                        weight: weight > 0 ? weight : undefined,
                    });
                }
            });
            
            await createSessionMutation.mutateAsync({
                workoutId: workout.id,
                startedAt: new Date(timer.startedAt).toISOString(),
                completedAt: new Date().toISOString(),
                durationSeconds: Math.round(timer.elapsed),
                sets,
            });

            await Promise.all(
                ["history", "home-stats", "workout-calendar", "streak"].map(
                    (queryKey) => queryClient.invalidateQueries({ queryKey: [queryKey] }),
                ),
            );
            return true;
        } catch (error) {
            console.log("Error saving workout session:", error);
            
            Alert.alert("Could not save", "Check your connection");
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [completed, createSessionMutation, queryClient, timer, workout]);

    const saveSessionRef = useRef(saveSession);

    useEffect(() => {
        saveSessionRef.current = saveSession;
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", (event) => {
            if (allowLeave.current) return;
            event.preventDefault();

            const wasPaused = timer.isPaused;
            timer.pause();

            const resumeTimer = () => {
                if (!wasPaused) timer.resume();
            };

            const leave = () => {
                allowLeave.current = true;
                navigation.dispatch(event.data.action);
            };

            if (completed.length === 0) {
                Alert.alert("Leave workout?", "Your progress will not be saved", [
                    { text: "Cancel", style: "cancel", onPress: resumeTimer },
                    { text: "Leave", style: "destructive", onPress: leave },
                ]);
                return;
            }

            Alert.alert(
                "Save progress?",
                `You completed ${completed.length} of ${totalSets} sets`,
                [
                    { text: "Cancel", style: "cancel", onPress: resumeTimer },
                    { text: "Discard", style: "destructive", onPress: leave },
                    {
                        text: "Save & Leave",
                        onPress: async () => {
                            if (await saveSessionRef.current()) leave();
                        },
                    },
                ],
            );
        });

        return unsubscribe;
    }, [completed, navigation, totalSets]);

    const finishWorkout = () => {
        const wasPaused = timer.isPaused;
        timer.pause();

        Alert.alert(
            "Finish Workout?",
            `${completed.length} of ${totalSets} sets completed`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => {
                        if (!wasPaused) timer.resume();
                    },
                },
                {
                    text: "Finish",
                    onPress: async () => {
                        if (!(await saveSession())) return;
                        allowLeave.current = true;
                        router.replace("/history");
                    },
                },
            ],
        );
    };

    const recordValue = (
        key: string,
        field: "reps" | "weight",
        value: string,
    ) => {
        valuesRef.current[key] = {
            ...valuesRef.current[key],
            [field]: value,
        };
    };

    const toggleSet = (exercise: WorkoutExercise, set: number) => {
        const key = `${exercise.id}-${set}`;
        const isDone = completed.includes(key);
        setCompleted((prev) =>
            isDone ? prev.filter((item) => item !== key) : [...prev, key],
        );
        
        if (!isDone) timer.startRest(exercise.rest ?? 0);
    };

    if (isPending) return <ActiveSkeleton />;

    if (isError || !workout) {
        return (<EmptyState message="Could not load this workout" onRetry={refetch} />);
    }

    return (
        <SafeAreaScreen edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <ActiveSession
                        completed={completed}
                        timer={timer}
                        workout={workout}
                        recordValue={recordValue}
                        toggleSet={toggleSet}
                        onFinish={finishWorkout}
                        onLeave={router.back}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            <RestTimer timer={timer} />

            <LoadingModal
                message="Saving workout..."
                visible={isSaving}
            />
        </SafeAreaScreen>
    );
};

type ActiveSessionProps = {
    completed: string[];
    onFinish: () => void;
    onLeave: () => void;
    recordValue: (key: string, field: "reps" | "weight", value: string) => void;
    timer: Timer;
    toggleSet: (exercise: WorkoutExercise, set: number) => void;
    workout: WorkoutDetail;
};

function ActiveSession({
    completed,
    onFinish,
    onLeave,
    recordValue,
    timer,
    toggleSet,
    workout,
}: ActiveSessionProps) {
    const muted = useAppThemeColor("mutedForeground");
    const primary = useAppThemeColor("primary");
    const [expanded, setExpanded] = useState(workout.exercises[0]?.name ?? "");

    const completedExercises = workout.exercises.filter((exercise) =>
        Array.from({ length: exercise.sets ?? 0 }, (_, index) => index + 1).every(
            (set) => completed.includes(`${exercise.id}-${set}`),
        ),
    ).length;

    return (
        <View className="flex-1">
            <View className="flex-grow px-5 pb-32">
                <View className="flex-row items-start justify-between pt-4">
                    <View>
                        <Text className="font-inter-bold text-[24px] text-foreground">
                            {workout.name}
                        </Text>
                        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                            {completedExercises}/{workout.exercises.length} exercises
                        </Text>
                    </View>
                    <Pressable accessibilityRole="button" onPress={onLeave}>
                        <Text className="font-inter-semibold text-[13px] text-primary">
                            Leave
                        </Text>
                    </Pressable>
                </View>

                <View className="flex-row items-center justify-between my-7">
                    <View>
                        <Text className="font-inter-bold text-[38px] tracking-[-1px] text-foreground">
                            {formatTime(timer.elapsed)}
                        </Text>
                        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                            Elapsed Time
                        </Text>
                    </View>
                    <Pressable
                        accessibilityLabel={
                            timer.isPaused ? "Resume workout" : "Pause workout"
                        }
                        className="items-center justify-center w-16 h-16 rounded-full bg-primary"
                        onPress={timer.togglePause}
                    >
                        <Feather
                            color="white"
                            name={timer.isPaused ? "play" : "pause"}
                            size={26}
                        />
                    </Pressable>
                </View>

                <View className="gap-3">
                    {workout.exercises.map((exercise) => {
                        const isExpanded = expanded === exercise.name;
                        return (
                            <View
                                className="overflow-hidden border rounded-xl border-border bg-card"
                                key={exercise.id}
                            >
                                <Pressable
                                    className="flex-row items-center px-4 py-4"
                                    onPress={() => setExpanded(isExpanded ? "" : exercise.name)}
                                >
                                    <View className="flex-1">
                                        <Text className="font-inter-bold text-[14px] text-foreground">
                                            {exercise.name}
                                        </Text>
                                        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                                            {exercise.sets} sets • {exercise.reps} reps •{" "}
                                            {exercise.rest}s rest
                                        </Text>
                                    </View>
                                    <Feather
                                        color={muted}
                                        name={isExpanded ? "chevron-up" : "chevron-down"}
                                        size={20}
                                    />
                                </Pressable>

                                {isExpanded && (
                                    <View className="border-t border-border">
                                        <View className="flex-row items-center h-10 px-4">
                                            {[
                                                ["SET", "w-12"],
                                                ["WEIGHT", "flex-1"],
                                                ["REPS", "flex-1"],
                                                ["STATUS", "w-14"],
                                            ].map(([label, width]) => (
                                                <Text
                                                    className={`${width} text-center font-inter-semibold text-[10px] text-muted-foreground`}
                                                    key={label}
                                                >
                                                    {label}
                                                </Text>
                                            ))}
                                        </View>

                                        {Array.from(
                                            { length: exercise.sets ?? 0 },
                                            (_, index) => index + 1,
                                        ).map((set) => {
                                            const key = `${exercise.id}-${set}`;
                                            const isDone = completed.includes(key);
                                            return (
                                                <View
                                                    className={cn(
                                                        "h-14 flex-row items-center border-t border-border px-4",
                                                        isDone && "bg-accent",
                                                    )}
                                                    key={key}
                                                >
                                                    <Text className="w-12 text-center font-inter-semibold text-[13px] text-foreground">
                                                        {set}
                                                    </Text>
                                                    <TextInput
                                                        className="mx-1 h-10 flex-1 rounded-lg bg-muted text-center font-inter text-[13px] text-foreground"
                                                        keyboardType="decimal-pad"
                                                        onChangeText={(value) =>
                                                            recordValue(key, "weight", value)
                                                        }
                                                        placeholder={
                                                            exercise.targetWeight
                                                                ? String(exercise.targetWeight)
                                                                : "kg"
                                                        }
                                                        placeholderTextColor={muted}
                                                        selectionColor={primary}
                                                    />
                                                    <TextInput
                                                        className="mx-1 h-10 flex-1 rounded-lg bg-muted text-center font-inter text-[13px] text-foreground"
                                                        defaultValue={String(exercise.reps)}
                                                        keyboardType="number-pad"
                                                        onChangeText={(value) =>
                                                            recordValue(key, "reps", value)
                                                        }
                                                        placeholderTextColor={muted}
                                                        selectionColor={primary}
                                                    />
                                                    <Pressable
                                                        accessibilityLabel={`Complete set ${set}`}
                                                        className="items-center w-14"
                                                        onPress={() => toggleSet(exercise, set)}
                                                    >
                                                        <Feather
                                                            color={isDone ? primary : muted}
                                                            name={isDone ? "check-circle" : "circle"}
                                                            size={22}
                                                        />
                                                    </Pressable>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
                <Button className="mt-5" onPress={onFinish} size="sm">
                    Finish Workout
                </Button>
            </View>
        </View>
    );
}

function RestTimer({ timer }: { timer: Timer }) {
    const insets = useSafeAreaInsets();

    if (timer.rest <= 0) return null;

    return (
        <View
            className="absolute items-center justify-center p-3 border-4 rounded-full shadow-lg right-5 h-28 w-28 border-slate-700 bg-slate-950"
            style={{ bottom: insets.bottom + 10 }}
        >
            <Text className="font-inter text-[10px] text-white">Rest Timer</Text>
            <Text className="mt-1 font-inter-bold text-[20px] text-blue-400">
                {Math.floor(timer.rest / 60)}:
                {String(Math.floor(timer.rest % 60)).padStart(2, "0")}
            </Text>
            <Pressable onPress={timer.skipRest}>
                <Text className="mt-1 font-inter-semibold text-[10px] text-blue-400">
                    Skip
                </Text>
            </Pressable>
        </View>
    );
}

function ActiveSkeleton() {
    return (
        <SafeAreaScreen edges={["top", "bottom"]}>
            <View className="flex-1 px-5 pt-4">
                <Skeleton className="w-2/3 h-8 rounded-lg" />
                <Skeleton className="w-24 h-4 mt-2 rounded-md" />
                <Skeleton className="h-12 rounded-lg mt-7 w-44" />
                <View className="gap-3 mt-8">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton className="w-full h-16 rounded-xl" key={index} />
                    ))}
                </View>
            </View>
        </SafeAreaScreen>
    );
}

export default ActiveSessionPage;