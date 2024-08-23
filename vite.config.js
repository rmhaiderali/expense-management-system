import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import express from "express";
import "dotenv/config.js";

function useExpressInVite(entry) {
  return {
    name: "expressAppMiddleware",
    configureServer: async (server) => {
      async function expressAppMiddleware(req, res, next) {
        const app = await server.ssrLoadModule(entry);
        app.default(req, res, next);
      }

      server.middlewares.use(expressAppMiddleware);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: process.env.PORT },
  plugins: [useExpressInVite("/src/backend/app.js"), react()],
});
