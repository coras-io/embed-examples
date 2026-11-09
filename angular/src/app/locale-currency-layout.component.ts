import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs";
import type {
  CorasConfig,
  CorasPageName,
  CorasPageParams,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import { createCorasRouting } from "@coras-io/embed/url";
import { CorasMountComponent } from "./coras-mount.component";
import { config } from "./config";
import { buildConfig, chrome, defaultCurrency, logo, url } from "./coras";

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
      [hrefFor]="routing.hrefFor"
      (navigate)="routing.onNavigate($event)"
      (stateChange)="routing.onStateChange($event)"
    />
    <router-outlet />
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class LocaleCurrencyLayoutComponent implements OnInit {
  page: CorasPageName = "landing";
  params: CorasPageParams = {};
  config!: CorasConfig;
  readonly chrome = chrome;

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // A navigation pushes a history entry, an in-page change replaces it.
  readonly routing = createCorasRouting({
    url,
    navigate: (href) => void this.router.navigateByUrl(href),
    replace: (href) =>
      void this.router.navigateByUrl(href, { replaceUrl: true }),
  });

  ngOnInit(): void {
    this.syncFromUrl();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.syncFromUrl());

    logo.addEventListener("click", this.goToLanding);
    this.destroyRef.onDestroy(() =>
      logo.removeEventListener("click", this.goToLanding),
    );
  }

  private syncFromUrl(): void {
    const { page, params, locale, currency } = url.parse(this.router.url);
    this.page = page;
    this.params = params;
    this.config = buildConfig(
      (locale ?? config.locale) as SupportedLocales,
      (currency ?? defaultCurrency(locale)) as SupportedCurrencies,
    );
  }

  private readonly goToLanding = (): void => {
    const { locale } = url.parse(this.router.url);
    void this.router.navigateByUrl(
      `/${(locale ?? config.locale).toLowerCase()}`,
    );
  };
}
