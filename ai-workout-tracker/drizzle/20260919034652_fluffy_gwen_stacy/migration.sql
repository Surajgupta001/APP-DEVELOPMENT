CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"description" text NOT NULL,
	"muscles" text NOT NULL,
	"equipment" text,
	"difficulty" text NOT NULL,
	"forceType" text,
	"mechanics" text,
	"category" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_session_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"sessionId" uuid NOT NULL,
	"exerciseId" uuid NOT NULL,
	"setNumber" text NOT NULL,
	"reps" text NOT NULL,
	"weight" text
);
--> statement-breakpoint
CREATE TABLE "workout_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workoutId" uuid NOT NULL,
	"exerciseId" uuid NOT NULL,
	"sets" text NOT NULL,
	"reps" text NOT NULL,
	"targetWeight" text,
	"restSeconds" text,
	"position" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" text NOT NULL,
	"workoutId" uuid NOT NULL,
	"startedAt" timestamp with time zone NOT NULL,
	"completedAt" timestamp with time zone NOT NULL,
	"durationSeconds" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wokouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"isTemplate" text DEFAULT 'false' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_session_sets" ADD CONSTRAINT "workout_session_sets_sessionId_workout_sessions_id_fkey" FOREIGN KEY ("sessionId") REFERENCES "workout_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_session_sets" ADD CONSTRAINT "workout_session_sets_exerciseId_exercises_id_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workoutId_wokouts_id_fkey" FOREIGN KEY ("workoutId") REFERENCES "wokouts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exerciseId_exercises_id_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_workoutId_wokouts_id_fkey" FOREIGN KEY ("workoutId") REFERENCES "wokouts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "wokouts" ADD CONSTRAINT "wokouts_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;