import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter, Subscription } from "rxjs";
import type {
  CorasConfig,
  CorasNavigateDetail,
  CorasPageName,
  CorasPageParams,
  CorasStateChangeDetail,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import { CorasMountComponent } from "./coras-mount.component";
import { config } from "./config";
import { buildConfig, chrome, logo, url } from "./coras";

/**
 * Single persistent mount for every page under `:locale/:currency`. The page
 * and params are derived from the URL, so navigating between child routes (and
 * back/forward) updates the mount in place instead of tearing it down — the
 * navbar, footer, and chrome stay put and only the page content swaps.
 */
@Component({
  selector: "app-locale-currency-layout",
  standalone: true,
  imports: [CorasMountComponent, RouterOutlet],
  template: `
    <coras-mount
      [page]="page"
      [params]="params"
      [config]="config"
      [chrome]="chrome"
      (navigate)="onNavigate($event)"
      (stateChange)="onStateChange($event)"
    />
    <router-outlet />
  `,
})
export class LocaleCurrencyLayoutComponent implements OnInit, OnDestroy {
  page: CorasPageName = "landing";
  params: CorasPageParams = {};
  config!: CorasConfig;
  readonly chrome = chrome;

  private routerSub?: Subscription;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    // Deep links and refreshes just work: the current view is read straight
    // from the URL rather than tracked in component state. Re-read on every
    // navigation (link or back/forward) so the mount updates in place.
    this.syncFromUrl();
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.syncFromUrl());

    // The navbar logo is host-owned DOM (slotted into the SDK navbar), so its
    // click is wired here: return to the landing page for the current
    // locale/currency.
    logo.addEventListener("click", this.goToLanding);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    logo.removeEventListener("click", this.goToLanding);
  }

  onNavigate(intent: CorasNavigateDetail): void {
    this.syncUrl(intent, false);
  }

  onStateChange(state: CorasStateChangeDetail): void {
    this.syncUrl(state, true);
  }

  private syncFromUrl(): void {
    const { page, params, locale, currency } = url.parse(this.router.url);
    this.page = page;
    this.params = params;
    this.config = buildConfig(
      (locale ?? config.locale) as SupportedLocales,
      (currency ?? config.currency) as SupportedCurrencies,
    );
  }

  // Host owns routing. Turn an SDK navigation *intent* into a real URL and hand
  // it to Angular Router; the route change flows back through `syncFromUrl` into
  // the mount. A navigate adds a history entry (a link/selection); a state
  // change replaces it (an in-page change such as a filter).
  private syncUrl(
    detail: CorasNavigateDetail | CorasStateChangeDetail,
    replace: boolean,
  ): void {
    if ("href" in detail && detail.href) {
      window.open(detail.href, "_blank", "noopener,noreferrer");
      return;
    }
    const href = url.build({
      page: detail.page,
      params: detail.params ?? {},
      locale: detail.locale,
      currency: detail.currency,
    });
    void this.router.navigateByUrl(href, { replaceUrl: replace });
  }

  private readonly goToLanding = (): void => {
    const { locale, currency } = url.parse(this.router.url);
    void this.router.navigateByUrl(
      `/${locale ?? config.locale}/${currency ?? config.currency}`,
    );
  };
}
