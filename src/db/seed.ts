import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";

import * as dotenv from "dotenv";

dotenv.config();

(async () => {
  // init db
  const sql_script = fs.readFileSync(
    path.resolve("./src/data/init-db.sql"),
    "utf-8"
  );

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  await client
    .query(sql_script)
    .then(() => console.log("Database seeded successfully!"))
    .catch((err) => console.error(err))
    .finally(() => client.release());
  process.exit(0);
})();
