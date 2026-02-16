import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  // REPLACE 'repo-name' WITH YOUR ACTUAL GITHUB REPO NAME
  // e.g. base: '/3d-hand-particles/',
  base: '3dreactivV4', 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
