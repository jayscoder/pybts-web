import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BTProject from "@/views/BTProject.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      children: [
        {
          path: "bt",
          name: "BTProject",
          component: BTProject,
          props: (route) => ({ project: route.query.project }),
        },
      ],
    },
  ],
});

export default router;
