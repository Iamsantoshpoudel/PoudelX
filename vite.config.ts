import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // Correct base path for Vercel
  server: {
    host: "localhost", // Secure for local dev
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(), // Only in dev
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: mode === "production" ? false : true, // Disable source maps in prod
    minify: "terser", // Ensure minification
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "firebase/app",         // Firebase core
            "firebase/auth",        // Firebase auth (includes Google Auth)
          ],
        },
      },
    },
  },
}));