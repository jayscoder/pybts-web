// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///Users/wangtong/Documents/GitHub/pybt-web/pybt-web/.yarn/__virtual__/vite-virtual-2b406dff05/5/.yarn/berry/cache/vite-npm-5.2.6-f05ef664d1-10c0.zip/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/wangtong/Documents/GitHub/pybt-web/pybt-web/.yarn/__virtual__/@vitejs-plugin-vue-virtual-7bd7250ea9/5/.yarn/berry/cache/@vitejs-plugin-vue-npm-5.0.4-e08dc8c74a-10c0.zip/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/wangtong/Documents/GitHub/pybt-web/pybt-web/.yarn/__virtual__/@vitejs-plugin-vue-jsx-virtual-267c6eb650/5/.yarn/berry/cache/@vitejs-plugin-vue-jsx-npm-3.1.0-d678ba9241-10c0.zip/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/wangtong/Documents/GitHub/pybt-web/pybt-web/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    port: 4e3,
    proxy: {
      // 选项写法
      "/api": {
        target: "http://127.0.0.1:10000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/api", "/api")
      }
    }
    // hmr: {
    //   overlay: false
    // },
    // host: '0.0.0.0'
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2FuZ3RvbmcvRG9jdW1lbnRzL0dpdEh1Yi9weWJ0LXdlYi9weWJ0LXdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dhbmd0b25nL0RvY3VtZW50cy9HaXRIdWIvcHlidC13ZWIvcHlidC13ZWIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dhbmd0b25nL0RvY3VtZW50cy9HaXRIdWIvcHlidC13ZWIvcHlidC13ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tIFwibm9kZTp1cmxcIjtcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3Z1ZSgpLCB2dWVKc3goKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDQwMDAsXG4gICAgcHJveHk6IHtcbiAgICAgIC8vIFx1OTAwOVx1OTg3OVx1NTE5OVx1NkNENVxuICAgICAgXCIvYXBpXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMjcuMC4wLjE6MTAwMDBcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKFwiL2FwaVwiLCBcIi9hcGlcIiksXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gaG1yOiB7XG4gICAgLy8gICBvdmVybGF5OiBmYWxzZVxuICAgIC8vIH0sXG4gICAgLy8gaG9zdDogJzAuMC4wLjAnXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1UsU0FBUyxlQUFlLFdBQVc7QUFFM1csU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUp5TCxJQUFNLDJDQUEyQztBQU83UCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUFBLEVBQ3pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxNQUVMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxRQUFRLE1BQU07QUFBQSxNQUNoRDtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
