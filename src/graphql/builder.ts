import SchemaBuilder from "@pothos/core";
import ValidationPlugin from "@pothos/plugin-validation";
import { GraphQLError } from "graphql";
import { pathToArray } from "graphql/jsutils/Path";

export const builder = new SchemaBuilder({
  plugins: [ValidationPlugin],
  validationOptions: {
    validationError: (zodError, _, __, info) => {
      const [{ message, path }] = zodError.issues;
      return new GraphQLError(message, {
        path: [...pathToArray(info.path), ...path],
        extensions: {
          code: "VALIDATION_ERROR",
        },
      });
    },
  },
});

import "./types/user";

builder.queryType({});
