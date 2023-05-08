CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid,
	"email" varchar(255),
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id" PRIMARY KEY("id");

CREATE UNIQUE INDEX IF NOT EXISTS "email" ON "users" ("email");