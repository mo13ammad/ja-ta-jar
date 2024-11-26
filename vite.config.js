import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://portal1.jatajar.com", // Your API server
        changeOrigin: true, // Needed to handle CORS
        secure: false, // If you're using HTTPS but have self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, ""), // Rewrite the API path
      },
    },
  },
});
