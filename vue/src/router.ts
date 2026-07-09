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
    // Detect the visitor's locale/currency once, then hand off to the
    // locale-scoped routes where everything real is mounted.
    path: "/",
    redirect: () => {
      const locale = getLocale(config.locale);
      const currency = getCurrency(locale);
      return `/${locale}/${currency}`;
    },
  },
  {
    // One layout owns the single persistent mount for every page below it. The
    // child routes only declare the URL shape (`landing` = root, `search`, and
    // `details` = a bare id segment) - the mount reads the URL and renders the
    // matching page, so navigating between them updates in place.
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
