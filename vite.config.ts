import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr({
    exportAsDefault: true,
  }), react()],
  resolve: {
    alias: {
      "skedulo-ui": path.resolve(__dirname, "./src/temp/"),
    },
  },
});
