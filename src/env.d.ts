/// <reference types="astro/client" />
import type { ZeroClient, ZeroConfig } from "zero-astro";
import type { Schema } from "./schema";
 
declare global {
  interface Window {
    __ZERO_CONFIG__: ZeroConfig<Schema>;
    __ZERO_CLIENT__?: ZeroClient<Schema>;
  }
}
