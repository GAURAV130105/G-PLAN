import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
<<<<<<< HEAD

// https://vitejs.dev/config/
export default defineConfig(() => ({
=======
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
  server: {
    host: "::",
    port: 8080,
  },
<<<<<<< HEAD
  plugins: [react()],
=======
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
