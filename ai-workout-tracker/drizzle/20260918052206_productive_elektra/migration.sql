ALTER TABLE "profiles" ADD COLUMN "id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey";--> statement-breakpoint
ALTER TABLE "profiles" ADD PRIMARY KEY ("id");