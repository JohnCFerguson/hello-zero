// @ts-check
import { defineConfig } from "astro/config";
import zero from "zero-astro";
import { schema } from "./src/schema.ts";
import { getRequestListener } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

// https://astro.build/config
export default defineConfig({
  integrations: [
    zero({
      publicServer: process.env.PUBLIC_SERVER,
      upstreamDb: process.env.ZERO_UPSTREAM_DB,
      cvrDb: process.env.ZERO_CVR_DB,
      changeDb: process.env.ZERO_CHANGE_DB,
      authSecret: process.env.ZERO_AUTH_SECRET,
      replicaFile: process.env.ZERO_REPLICA_FILE,
      schema,
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
    plugins: [
      {
        name: "api-server",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (!req.url?.startsWith("/api")) {
              return next();
            }
            getRequestListener(async (request) => {
              return await app.fetch(request, {});
            })(req, res);
          });
        },
      },
    ],
  },
});
