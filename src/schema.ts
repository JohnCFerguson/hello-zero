import {
  ANYONE_CAN,
  createSchema,
  createTableSchema,
  definePermissions,
  NOBODY_CAN,
  Row,
} from "@rocicorp/zero";

// NOTE:
// You need your db to exist that matches this schema.
// I  don't have migration code in this repo, feel free to add

import { createSchema, createTableSchema } from "@rocicorp/zero";

const todoSchema = createTableSchema({
  tableName: "todo",
  columns: {
    id: { type: "string" },
    title: { type: "string" },
    completed: { type: "boolean" },
  },
  primaryKey: ["id"],
  relationships: {},
});

// const userSchema = createTableSchema({
//   tableName: "user",
//   columns: {
//     id: { type: "number" },
//     name: { type: "string" },
//     email: { type: "string" },
//   },
//   primaryKey: ["id"],
// });

export const schema = createSchema({
  version: 1,
  tables: {
    todo: todoSchema,
    // user: userSchema,
  },
});

export type Schema = typeof schema;
export type Todo = Row<typeof todoSchema>;
// export type User = Row<typeof userSchema>;

// The contents of your decoded JWT.
type AuthData = {
  sub: string | null;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  return {
    todo: {
      row: {
        // anyone can insert
        insert: ANYONE_CAN,
        // only sender can edit their own messages
        update: ANYONE_CAN,
        // must be logged in to delete
        delete: ANYONE_CAN,
      },
    },
    // user: {
    //   row: {
    //     // anyone can insert
    //     insert: NOBODY_CAN,
    //     // only sender can edit their own messages
    //     update: NOBODY_CAN,
    //     // must be logged in to delete
    //     delete: NOBODY_CAN,
    //   },
    // },
  };
});
