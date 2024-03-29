import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import EChartsProject from "@/views/EChartsProject.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      children: [
        {
          path: "echarts/:project",
          name: "EChartsProject",
          component: EChartsProject,
          props: true,
        },
      ],
    },
  ],
});

export default router;
