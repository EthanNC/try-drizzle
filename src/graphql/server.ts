import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { builder } from "./builder";

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
