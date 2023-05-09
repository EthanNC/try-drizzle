import { eq } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  uuid,
  timestamp,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { db } from "./client";

export const users = pgTable(
  "users",
  {
    id: uuid("id").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    name: text("name"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (user) => ({
    id: primaryKey(user.id),
    email: uniqueIndex("email").on(user.email),
  })
);

export const UserSchema = createSelectSchema(users, {
  id: (schema) => schema.id.uuid({ message: "Not a valid id" }),
  email: (schema) => schema.email.email({ message: "that not an email" }),
  name: (schema) => schema.name.optional(),
  createdAt: (schema) => schema.createdAt,
});

export type User = z.infer<typeof UserSchema>;

export const fromID = async (id: string) =>
  await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .execute()
    .then((rows) => rows[0]);

export const fromEmail = async (email: string) =>
  await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute()
    .then((rows) => rows[0]);
