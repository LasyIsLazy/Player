import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      // TODO: Home
      component: () => import("./pages/test-page/TestPage.vue"),
    },
    {
      path: "/test",
      component: () => import("./pages/test-page/TestPage.vue"),
    },
  ],
});
