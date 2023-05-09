import { db } from "../../db/client";
import { User, UserSchema, fromEmail, fromID, users } from "../../db/schema";
import { builder } from "../builder";
import { v4 as uuidv4 } from "uuid";

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
  users: t.field({
    type: [UserType],
    resolve: async () => {
      const result = await db.select().from(users).execute();
      return result;
    },
  }),
}));

builder.mutationFields((t) => ({
  createUser: t.field({
    type: UserType,
    args: {
      email: t.arg.string({
        required: true,
        validate: {
          schema: UserSchema.shape.email,
        },
      }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      const id = uuidv4();
      const result = await db
        .insert(users)
        .values({
          id: id,
          email: args.email,
          name: args.name,
        })
        .returning()
        .execute();

      return result[0];
    },
  }),
}));
