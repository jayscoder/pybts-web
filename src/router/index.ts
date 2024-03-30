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
          path: "echarts",
          name: "EChartsProject",
          component: EChartsProject,
          props: (route) => ({ project: route.query.project }),
        },
      ],
    },
  ],
});

export default router;
