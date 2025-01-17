// @ts-check
import { defineConfig } from "astro/config";
import zero from "zero-astro";

// https://astro.build/config
export default defineConfig({
  integrations: [zero()],
});
