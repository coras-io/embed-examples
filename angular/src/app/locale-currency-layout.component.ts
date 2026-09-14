import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs";
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
