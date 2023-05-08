import { InferModel, eq } from "drizzle-orm";
import { db } from "./db/client";
import * as schema from "./db/schema";
import { v4 as uuidv4 } from "uuid";

async function createUser(user: InferModel<typeof schema.users, "insert">) {
  const date = new Date();
  const response = await db
    .insert(schema.users)
    .values({
      ...user,
      createdAt: date,
      id: uuidv4(),
    })
    .returning();

  // we know that the response will be an array of one element
  return response[0].id;
}

(async () => {
  // pull name from command line
  const name = process.argv[2];
  if (!name) {
    console.error("Please provide a name");
    process.exit(1);
  }

  // create a new user
  await createUser({ name, email: name + "@example.com" });

  const users = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.name, name))
    .execute();
  console.log(users);

  process.exit(0);
})();
