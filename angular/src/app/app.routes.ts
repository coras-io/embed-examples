import { inject } from "@angular/core";
import { Router, Routes } from "@angular/router";
import { getLocale } from "@coras-io/embed/helpers";
import { config } from "./config";
import { EmbeddedPageComponent } from "./embedded-page.component";
import { LocaleCurrencyLayoutComponent } from "./locale-currency-layout.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    canActivate: [
      // The currency is the locale's default, so the URL does not name it.
      () =>
        inject(Router).createUrlTree([getLocale(config.locale).toLowerCase()]),
    ],
    children: [],
  },
  {
    path: ":locale",
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
