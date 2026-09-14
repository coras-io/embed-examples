import { inject } from "@angular/core";
import { Router, Routes } from "@angular/router";
import { getCurrency, getLocale } from "@coras-io/embed/helpers";
import { config } from "./config";
import { EmbeddedPageComponent } from "./embedded-page.component";
import { LocaleCurrencyLayoutComponent } from "./locale-currency-layout.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    canActivate: [
      () => {
        const locale = getLocale(config.locale);
        const currency = getCurrency(locale);
        return inject(Router).createUrlTree([locale, currency]);
      },
    ],
    children: [],
  },
  {
    path: ":locale/:currency",
    component: LocaleCurrencyLayoutComponent,
    children: [
      { path: "", component: EmbeddedPageComponent },
      { path: "search", component: EmbeddedPageComponent },
      { path: "payment", component: EmbeddedPageComponent },
      { path: "help", component: EmbeddedPageComponent },
      { path: ":id", component: EmbeddedPageComponent },
    ],
  },
];
