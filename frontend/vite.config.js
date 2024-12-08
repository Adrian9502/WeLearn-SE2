import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "https://welearn-api.vercel.app",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      "/uploads": {
        target: "https://welearn-api.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
