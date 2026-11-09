import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { getLocale } from "@coras-io/embed/helpers";
import { config } from "./config.ts";
import LocaleCurrencyLayout from "./views/LocaleCurrencyLayout.vue";
import EmbeddedPage from "./views/EmbeddedPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    // The currency is the locale's default, so the URL does not name it.
    redirect: () => `/${getLocale(config.locale).toLowerCase()}`,
  },
  {
    path: "/:locale",
    component: LocaleCurrencyLayout,
    children: [
      { path: "", name: "landing", component: EmbeddedPage },
      { path: "search", name: "search", component: EmbeddedPage },
      { path: "payment", name: "payment", component: EmbeddedPage },
      { path: "help", name: "help", component: EmbeddedPage },
      { path: ":id", name: "details", component: EmbeddedPage },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
