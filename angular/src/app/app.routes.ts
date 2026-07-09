import { inject } from "@angular/core";
import { Router, Routes } from "@angular/router";
import { getCurrency, getLocale } from "@coras-io/embed/helpers";
import { config } from "./config";
import { EmbeddedPageComponent } from "./embedded-page.component";
import { LocaleCurrencyLayoutComponent } from "./locale-currency-layout.component";

export const routes: Routes = [
  {
    // Detect the visitor's locale/currency once, then redirect into the
    // locale-scoped routes where everything real is mounted.
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
    // One layout owns the single persistent mount for every page below it. The
    // child routes only declare the URL shape (`landing` = root, `search`,
    // `payment`, `help`, and `details` = a bare id segment) - the mount reads
    // the URL and renders the matching page, so navigating updates in place.
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
