import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@services": fileURLToPath(new URL("./src/services", import.meta.url)),
      "@store": fileURLToPath(new URL("./src/store", import.meta.url)),
      "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
    },
  },

  server: {
    port: 1420,
    strictPort: true,
  },
});