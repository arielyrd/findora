import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger"; // HAPUS atau KOMENTARI baris ini jika error ESM

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    // mode === 'development' && componentTagger(), // HAPUS atau KOMENTARI baris ini jika error ESM
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
