import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows external access
    port: 5173, // Default Vite port
    proxy: {
      // Proxy for all API routes
      "/api": {
        target: "https://welearn-api.vercel.app",
        changeOrigin: true,
        secure: false,
      },
      // Proxy for uploads
      "/uploads": {
        target: "https://welearn-api.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
