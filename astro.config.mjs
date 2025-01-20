// @ts-check
import { defineConfig } from "astro/config";
import zeroAstro from "zero-astro";
import { schema } from "./src/schema";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const zeroConfig = {
  publicServer: process.env.PUBLIC_SERVER,
  userID: crypto.randomUUID(),
  schema,
  kvStore: "idb",
};

if (!zeroConfig.publicServer) {
  throw new Error("PUBLIC_SERVER environment variable is required");
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    zeroAstro({
      projectId: "zero-project-id",
      environment: "development",
    }),
  ],
  output: "server",
  vite: {
    optimizeDeps: {
      include: ["@rocicorp/zero"],
    },
    ssr: {
      noExternal: ["@rocicorp/zero"],
    },
  },
  server: {
    host: true,
    port: 4321,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
