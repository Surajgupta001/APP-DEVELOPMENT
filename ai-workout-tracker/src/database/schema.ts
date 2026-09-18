import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
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
})