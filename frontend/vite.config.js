import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      "/receitas": {
        target: "http://gerador-receitas.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
