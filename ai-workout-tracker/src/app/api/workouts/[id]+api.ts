import { db, exercises as exerciseTable, workoutExercises, workouts } from "@/database";
import { auth } from "@/lib/auth";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.uuid();

export async function GET(request: Request, { id }: Record<string, string>) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session) {
        return new Response("Unauthorized", {
            status: 401,
        });
    }

    if (!idSchema.safeParse(id).success) {
        return new Response("Invalid workout ID", {
            status: 400,
        });
    }

    const result = await db.transaction(async (tx) => {
        const [workout] = await tx
            .select({
                id: workouts.id,
                name: workouts.name,
                description: workouts.description,
                image: workouts.image,
            })
            .from(workouts)
            .where(
                and(
                    eq(workouts.id, id),
                    eq(workouts.userId, session.user.id),
                ),
            )
            .limit(1);

        if (!workout) {
            return null;
        }
        
        const exerciseRows = await tx
            .select({
                id: exerciseTable.id,
                image: exerciseTable.image,
                muscles: exerciseTable.muscles,
                name: exerciseTable.name,
                position: workoutExercises.position,
                reps: workoutExercises.reps,
                rest: workoutExercises.restSeconds,
                sets: workoutExercises.sets,
                targetWeight: workoutExercises.targetWeight,
            })
            .from(workoutExercises)
            .innerJoin(
                exerciseTable,
                eq(exerciseTable.id, workoutExercises.exerciseId),
            )
            .where(eq(workoutExercises.workoutId, id))
            .orderBy(asc(workoutExercises.position));

        return {
            workout,
            exercises: exerciseRows,
        };
    });

    if (!result) {
        return new Response("Workout not found", {
            status: 404,
        });
    }

    const muscles = [
        ...new Set(
            result.exercises
                .map(({ muscles }) => muscles)
                .filter(Boolean),
        ),
    ].join(" • ");

    return Response.json({
        ...result.workout,
        exercises: result.exercises,
        muscles,
    });
}