import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // minify: "terser",
    outDir: "dist",
    // sourcemap: "inline",
    assetsDir: "static",
    // terserOptions: {
    //   compress: {
    //     drop_debugger: true,
    //     drop_console: true,
    //   },
    // },
  },
  server: {
    port: 4000,
    proxy: {
      // 选项写法
      "/api": {
        target: "http://127.0.0.1:10000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/api", "/api"),
      },
    },
    // hmr: {
    //   overlay: false
    // },
    // host: '0.0.0.0'
  },
});
