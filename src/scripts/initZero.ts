import { getZeroClient, type ZeroConfig } from "zero-astro";
import type { Schema } from "../schema";

export async function initZero(config: ZeroConfig<Schema>) {
  if (!config.publicServer) {
    throw new Error("PUBLIC_SERVER is required in ZERO_CONFIG");
  }
  const zero = await getZeroClient(config);
  window.__ZERO_CLIENT__ = zero;
}
