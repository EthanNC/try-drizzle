import { InferModel, eq } from "drizzle-orm";
import { db } from "./db/client";
import * as schema from "./db/schema";

async function createUser(user: InferModel<typeof schema.users, "insert">) {
  const response = await db.insert(schema.users).values(user).returning();

  // we know that the response will be an array of one element
  return response[0].id;
}

async function createProduct(
  product: InferModel<typeof schema.products, "insert">
) {
  const response = await db.insert(schema.products).values(product).returning();

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
  // const id = await createProduct({
  //   name,
  //   quantityPerUnit: "1",
  //   unitPrice: 1,
  //   unitsInStock: 1,
  //   unitsOnOrder: 1,
  //   reorderLevel: 1,
  //   discontinued: 1,
  //   supplierId: "1",
  // });

  // console.log(`Created user with id ${id}`);

  const users = await db
    .select()
    .from(schema.products)
    .innerJoin(
      schema.suppliers,
      eq(schema.suppliers.id, schema.products.supplierId)
    );
  console.log(users);

  process.exit(0);
})();
