CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"isTemplate" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workout_exercises" DROP CONSTRAINT "workout_exercises_workoutId_wokouts_id_fkey";--> statement-breakpoint
ALTER TABLE "workout_sessions" DROP CONSTRAINT "workout_sessions_workoutId_wokouts_id_fkey";--> statement-breakpoint
DROP TABLE "wokouts";--> statement-breakpoint
ALTER TABLE "workout_session_sets" ALTER COLUMN "setNumber" SET DATA TYPE integer USING "setNumber"::integer;--> statement-breakpoint
ALTER TABLE "workout_session_sets" ALTER COLUMN "reps" SET DATA TYPE integer USING "reps"::integer;--> statement-breakpoint
ALTER TABLE "workout_exercises" ALTER COLUMN "sets" SET DATA TYPE integer USING "sets"::integer;--> statement-breakpoint
ALTER TABLE "workout_exercises" ALTER COLUMN "reps" SET DATA TYPE integer USING "reps"::integer;--> statement-breakpoint
ALTER TABLE "workout_exercises" ALTER COLUMN "targetWeight" SET DATA TYPE real USING "targetWeight"::real;--> statement-breakpoint
ALTER TABLE "workout_exercises" ALTER COLUMN "restSeconds" SET DATA TYPE integer USING "restSeconds"::integer;--> statement-breakpoint
ALTER TABLE "workout_exercises" ALTER COLUMN "restSeconds" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_exercises" ALTER COLUMN "position" SET DATA TYPE integer USING "position"::integer;--> statement-breakpoint
ALTER TABLE "workout_sessions" ALTER COLUMN "durationSeconds" SET DATA TYPE integer USING "durationSeconds"::integer;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_slug_key" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workoutId_workouts_id_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_workoutId_workouts_id_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_session_sets" DROP CONSTRAINT "workout_session_sets_exerciseId_exercises_id_fkey", ADD CONSTRAINT "workout_session_sets_exerciseId_exercises_id_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id");