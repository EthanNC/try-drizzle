import {
  pgTable,
  varchar,
  text,
  uuid,
  timestamp,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id"),
    email: varchar("email", { length: 255 }),
    name: text("name"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (user) => ({
    id: primaryKey(user.id),
    email: uniqueIndex("email").on(user.email),
  })
);
