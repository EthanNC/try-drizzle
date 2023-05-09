import { User, UserSchema, fromEmail, fromID } from "../../db/schema";
import { builder } from "../builder";

const UserType = builder.objectRef<User>("User").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    name: t.exposeString("name", { nullable: true }),
    createdAt: t.string({
      resolve: (user) => user.createdAt.toISOString(),
    }),
  }),
});

builder.queryFields((t) => ({
  user: t.field({
    type: UserType,
    args: {
      id: t.arg.string({
        required: false,
        validate: {
          schema: UserSchema.shape.id,
        },
      }),
      email: t.arg.string({
        required: false,
        validate: {
          schema: UserSchema.shape.email,
        },
      }),
    },
    validate: [
      (args) => !!args.id || !!args.email,
      { message: "Must provide user id or email address" },
    ],
    resolve: async (_, args) => {
      const result = args.id
        ? await fromID(args.id)
        : args.email
        ? await fromEmail(args.email)
        : null;

      if (!result) {
        throw new Error("user not found");
      }

      return result;
    },
  }),
}));
