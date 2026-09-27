/**
 * API response and request payload types shared across the app.
 * Kept separate from `lib/api.ts` so UI and hooks can import types
 * without pulling in the fetch layer.
 */

export type WorkoutListItem = {
    exerciseCount: number;
    id: string;
    image: string | null;
    muscles: string;
    name: string;
    totalSets: number;
};

export type CreateWorkoutInput = {
    name: string;
    description?: string;
    image?: string;
    exercises: {
        id: string;
        reps?: number;
        rest?: number;
        sets?: number;
    }[];
};

export type ExerciseItem = {
    category: string;
    description: string;
    difficulty: string;
    equipment: string | null;
    forceType: string | null;
    id: string;
    image: string | null;
    mechanics: string | null;
    muscles: string;
    name: string;
};

export type WorkoutExercise = {
    id: string;
    image: string | null;
    muscles: string;
    name: string;
    targetWeight?: number | null;
    reps?: number;
    rest?: number;
    sets?: number;
};

export type WorkoutDetail = {
    description: string | null;
    exercises: WorkoutExercise[];
    id: string;
    image: string | null;
    muscles: string;
    name: string;
};

export type SaveSessionSet = {
    exerciseId: string;
    reps: number;
    setNumber: number;
    weight?: number;
};

export type SaveSessionInput = {
    completedAt: string;
    durationSeconds: number;
    sets: SaveSessionSet[];
    startedAt: string;
    workoutId: string;
};

export type HistorySessionItem = {
    id: string;
    workoutId: string;
    workoutName: string;
    image: string | null;
    completedAt: string;
    durationSeconds: number;
    exerciseCount: number;
    setCount: number;
};

export type HistorySet = {
    reps: number;
    weight: number | null;
};

export type HistoryExercise = {
    id: string;
    name: string;
    image: string | null;
    sets: HistorySet[];
};

export type HistoryDetail = {
    id: string;
    image: string | null;
    workoutId: string;
    workoutName: string;
    completedAt: string;
    durationSeconds: number;
    exercises: HistoryExercise[];
    setCount: number;
    volume: number | null;
};

export type HomeStats = {
    avgTimeSeconds: number;
    totalTimeSeconds: number;
    workouts: number;
};

export type WorkoutCalendarDates = {
    workoutDates: string[];
};
