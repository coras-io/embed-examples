import {
  AfterViewInit,
  Component,
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

@Component({
  selector: "coras-mount",
  standalone: true,
  template: `<div #container></div>`,
  styles: `
    :host,
    div {
      display: contents;
    }
  `,
})
export class CorasMountComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input({ required: true }) page!: CorasPageName;
  @Input() params?: CorasPageParams;
  @Input({ required: true }) config!: CorasConfig;
  @Input() chrome?: CorasChrome;

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
