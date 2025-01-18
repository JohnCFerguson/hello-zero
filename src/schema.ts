import {
  ANYONE_CAN,
  createSchema,
  createTableSchema,
  definePermissions,
  ExpressionBuilder,
  NOBODY_CAN,
  Row,
  TableSchema,
} from "@rocicorp/zero";

const todoSchema = createTableSchema({
  tableName: "todo",
  columns: {
    id: { type: "string" },
    title: { type: "string" },
    completed: { type: "boolean" },
  },
  primaryKey: "id",
  relationships: {},
});

export const schema = createSchema({
  version: 1,
  tables: {
    todo: todoSchema,
  },
});

export type Schema = typeof schema;
export type Todo = Row<typeof todoSchema>;

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
  };
});
