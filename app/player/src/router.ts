import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./pages/home/playing/PlayingPage.vue"),
    },
    {
      path: "/test",
      component: () => import("./pages/test-page/TestPage.vue"),
    },
  ],
});
