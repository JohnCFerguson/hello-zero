import { ZeroConfig } from "zero-astro";
import { Schema, schema } from "../schema";

export const defaultConfig: ZeroConfig<Schema> = {
  publicServer: import.meta.env.PUBLIC_SERVER || "",
  upstreamDb: "zero",
  cvrDb: "zero-cvr",
  changeDb: "zero-changes",
  replicaFile: "replica.db",
  schema: schema,
  userID: "default-user",
  kvStore: "idb",
};
