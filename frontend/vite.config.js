import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  publicDir: "public",
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target:
          mode === "production"
            ? "https://welearn-api.vercel.app"
            : "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            console.log("Proxy error:", err);
            if (!res.headersSent) {
              res.writeHead(500, {
                "Content-Type": "application/json",
              });
              res.end(JSON.stringify({ error: "Proxy error" }));
            }
          });
        },
      },
    },
  },
}));
