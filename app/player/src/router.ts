import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./App.vue"),
    },
    {
      path: "/test",
      component: () => import("./pages/test-page/TestPage.vue"),
    },
  ],
});
