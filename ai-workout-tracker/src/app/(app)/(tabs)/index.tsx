import { useStreak } from "@/contexts/streak-context";
import { useHomeStatsQuery, useWorkoutCalendarDatesQuery } from "@/hooks/queries";
import { addWeeks, startOfDay, startOfWeek, subWeeks } from "date-fns";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import HomeStats from "@/components/home/home-stats";
import MyWorkouts from "@/components/home/my-workouts";
import RecentWorkout from "@/components/home/recent-workout";
import WorkoutTemplates from "@/components/home/workout-templates";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import WeekCalendar from "@/components/week-calendar";

const logo = require("../../../../assets/images/app-images/logo.png");
const streakIcon = require("../../../../assets/images/app-images/streak-icon.png");

export default function HomePage() {
    const { currentStreak, showStreak } = useStreak();

    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));

    const currentWeekStart = startOfWeek(new Date());
    const calendarStart = subWeeks(currentWeekStart, 2);
    const calendarEnd = addWeeks(currentWeekStart, 1);

    const { data: stats, isPending } = useHomeStatsQuery(selectedDate);

    const { data } = useWorkoutCalendarDatesQuery(calendarStart, calendarEnd);

    const workoutDates = data?.workoutDates
        ? data.workoutDates.map((dateStr) => new Date(dateStr))
        : undefined;

    return (
        <SafeAreaScreen edges={["top", "bottom"]}>
            <ScrollView
                className="flex-1"
                contentContainerClassName="px-5 pb-5 pt-2"
                showsVerticalScrollIndicator={false}
            >
                {/* {Header Section} */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-0">
                        <View className="w-16 -ml-4 overflow-hidden h-11">
                            <Image
                                className="w-full h-full"
                                resizeMode="cover"
                                source={logo}
                            />
                        </View>
                        <Text
                            accessibilityRole="header"
                            className="font-inter-bold text-[22px] text-foreground"
                        >
                            MyWorkout
                        </Text>
                    </View>
                    <Pressable
                        className="flex-row items-center px-3 border rounded-full h-11 border-border bg-card active:bg-muted"
                        onPress={showStreak}
                    >
                        <Image
                            className="w-6 h-6"
                            resizeMode="contain"
                            source={streakIcon}
                        />
                        <Text className="ml-1.5 mr-0.5 font-inter-bold text-[14px] text-foreground">
                            {currentStreak || 0}
                        </Text>
                    </Pressable>
                </View>

                {/* {Week Calendar Section} */}
                <WeekCalendar
                    markedDates={workoutDates}
                    onChange={setSelectedDate}
                    value={selectedDate}
                />

                <HomeStats
                    avgTimeSeconds={stats?.avgTimeSeconds}
                    isPending={isPending}
                    totalTimeSeconds={stats?.totalTimeSeconds}
                    workouts={stats?.workouts}
                />
                <MyWorkouts />
                <RecentWorkout />
                <WorkoutTemplates />
            </ScrollView>
        </SafeAreaScreen>
    );
}