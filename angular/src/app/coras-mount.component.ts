import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import {
  mount,
  type CorasApp,
  type CorasChrome,
  type CorasConfig,
  type CorasNavigateDetail,
  type CorasPageName,
  type CorasPageParams,
  type CorasStateChangeDetail,
} from "@coras-io/embed";

/**
 * Thin Angular wrapper around the SDK `mount()` contract. It mounts once in
 * `ngAfterViewInit` (the SDK renders web components, so it must run in the
 * browser after the host element exists - never during SSR), reflects
 * page/params/config changes with `app.update()` (never a remount), and tears
 * the app down in `ngOnDestroy`.
 *
 * This is host integration code, not a published wrapper: every framework uses
 * the same `mount()` / `update()` / `unmount()` API.
 */
@Component({
  selector: "coras-mount",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<div #container></div>`,
})
export class CorasMountComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input({ required: true }) page!: CorasPageName;
  @Input() params?: CorasPageParams;
  @Input({ required: true }) config!: CorasConfig;
  @Input() chrome?: CorasChrome;

  // The host owns routing: the SDK reports intent, the parent turns it into a
  // real navigation. `update` does not re-emit these, so feeding a URL-derived
  // page back in cannot loop.
  @Output() navigate = new EventEmitter<CorasNavigateDetail>();
  @Output() stateChange = new EventEmitter<CorasStateChangeDetail>();

  @ViewChild("container", { static: true })
  private container!: ElementRef<HTMLDivElement>;

  private app: CorasApp | null = null;

  ngAfterViewInit(): void {
    this.app = mount({
      container: this.container.nativeElement,
      strict: true,
      page: this.page,
      params: this.params,
      config: this.config,
      chrome: this.chrome,
      onNavigate: (detail) => this.navigate.emit(detail),
      onStateChange: (detail) => this.stateChange.emit(detail),
    });
  }

  ngOnChanges(): void {
    // The first change set arrives before `ngAfterViewInit`, when the app does
    // not exist yet - the initial state is passed straight to `mount()` there.
    // Every later change reflects in place.
    this.app?.update({
      page: this.page,
      params: this.params,
      config: this.config,
    });
  }

  ngOnDestroy(): void {
    this.app?.unmount();
    this.app = null;
  }
}
