/// <reference types="astro/client" />
import type { Zero } from "@rocicorp/zero";
import type { Schema } from "./schema";

declare global {
  namespace App {
    interface Locals {
      zeroClient: Zero<Schema>;
    }
  }
}
