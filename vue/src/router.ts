import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { getCurrency, getLocale } from "@coras-io/embed/helpers";
import { config } from "./config.ts";
import LocaleCurrencyLayout from "./views/LocaleCurrencyLayout.vue";
import EmbeddedPage from "./views/EmbeddedPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: () => {
      const locale = getLocale(config.locale);
      const currency = getCurrency(locale);
      return `/${locale}/${currency}`;
    },
  },
  {
    path: "/:locale/:currency",
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
