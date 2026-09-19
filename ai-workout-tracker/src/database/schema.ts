import { pgEnum, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';
export * from './auth-schema';

export const genderEnum = pgEnum('gender', ['male', 'female']);
export const goalEnum = pgEnum('goal', ['build-muscle', 'lose-fat', 'maintain']);
export const experienceEnum = pgEnum('experience', ["beginner", "intermediate", "advanced"]);
export const weightUnitEnum = pgEnum('weight_unit', ['kg', 'lb']);

export const profiles = pgTable('profiles', {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
        .notNull()
        .primaryKey()
        .references(() => user.id, { onDelete: 'cascade' }),

    gender: genderEnum().notNull(),
    goal: goalEnum().notNull(),
    experience: experienceEnum().notNull(),
    weightUnit: weightUnitEnum().notNull().default('kg'),
    createdAt: timestamp({ 'withTimezone': true }).notNull().defaultNow(),
    updatedAt: timestamp({ 'withTimezone': true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const workouts = pgTable('wokouts', {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    description: text(),
    isTemplate: text().notNull().default('false'),
    createdAt: timestamp({ 'withTimezone': true }).notNull().defaultNow(),
    updatedAt: timestamp({ 'withTimezone': true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const exercises = pgTable('exercises', {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    slug: text().notNull(),
    name: text().notNull(),
    image: text(),
    description: text().notNull(),
    muscles: text().notNull(),
    equipment: text(),
    difficulty: text().notNull(),
    forceType: text(),
    mechanics: text(),
    category: text().notNull(),
    createdAt: timestamp({ 'withTimezone': true }).notNull().defaultNow(),
});

export const workoutExercises = pgTable('workout_exercises', {
    id: uuid().primaryKey().defaultRandom(),
    workoutId: uuid()
        .notNull()
        .references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: uuid()
        .notNull()
        .references(() => exercises.id, { onDelete: 'cascade' }),
    sets: text().notNull(),
    reps: text().notNull(),
    targetWeight: text(),
    restSeconds: text(),
    position: text().notNull(),
});

export const workoutSessions = pgTable('workout_sessions', {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    workoutId: uuid()
        .notNull()
        .references(() => workouts.id, { onDelete: 'cascade' }),
    startedAt: timestamp({ 'withTimezone': true }).notNull(),
    completedAt: timestamp({ 'withTimezone': true }).notNull(),
    durationSeconds: text().notNull(),
    createdAt: timestamp({ 'withTimezone': true }).notNull().defaultNow(),
});

export const workSessionSets = pgTable('workout_session_sets', {
    id: uuid().primaryKey().defaultRandom(),
    sessionId: uuid()
        .notNull()
        .references(() => workoutSessions.id, { onDelete: 'cascade' }),
    exerciseId: uuid()
        .notNull()
        .references(() => exercises.id, { onDelete: 'cascade' }),
    setNumber: text().notNull(),
    reps: text().notNull(),
    weight: real(),
});

export type Profile = typeof profiles.$inferSelect;
export type newProfile = typeof profiles.$inferInsert;
export type Exercise = typeof exercises.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type WorkoutSessionSet = typeof workSessionSets.$inferSelect;