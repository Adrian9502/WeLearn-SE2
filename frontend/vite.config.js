import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows external access
    port: 5173, // Default Vite port
    proxy: {
      // Proxy for API routes
      "/api": {
        target: "https://welearn-api.vercel.app",
        changeOrigin: true,
        secure: false,
      },
      "/api/users": {
        target: "https://welearn-api.vercel.app",
        changeOrigin: true,
        secure: false,
      },
      // Proxy for authentication routes without /api prefix
      "/api//register": {
        target: "https://welearn-api.vercel.app",
        changeOrigin: true,
        secure: false,
      },
      "/api//login": {
        target: "https://welearn-api.vercel.app",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "https://welearn-api.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
