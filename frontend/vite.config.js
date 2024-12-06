import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      host: true, // This allows external access
      port: 5173, // Default Vite port
      // Proxy for API routes
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/api/users": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      // Proxy for authentication routes without /api prefix
      "/register": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/login": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
