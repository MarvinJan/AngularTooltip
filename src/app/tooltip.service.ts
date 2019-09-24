import { Injectable, Renderer2 } from "@angular/core";
import { fromEvent, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TooltipService {
  // not a Subject or an Observable since there is no need for async operations
  public activeTooltip: HTMLElement = null;
  public activeTooltipHost: HTMLElement = null;
  public render: Renderer2;

  documentClick = fromEvent(document, "click");
  documentKeyDown = fromEvent(document, "keydown");
  documentScroll = fromEvent(document, "scroll");

  removeOnDocumentClick = this.documentClick.subscribe(e => {
    const element: HTMLElement = e.target as HTMLElement; // TypeScript sees e.target as EventTarget and has problems with .hasAttribute
    if (this.activeTooltip) {
      if (element === this.activeTooltip || element.hasAttribute("appTooltip"))
        return false;
      else this.removeTooltip();
    }
  });
  removeOnEscDown = this.documentKeyDown.subscribe(e => {
    const keyDown = e as KeyboardEvent; // TypeScript sees keydown as an Event that has no .key rather than KeyboardEvent
    if (keyDown.key === "Escape") {
      this.removeTooltip();
    }
  });
  changeTooltipPlacementOnScroll = this.documentScroll.subscribe(e => {
    if (this.activeTooltip) {
      const parentWindowOffsetTop = this.activeTooltipHost.getBoundingClientRect()
        .top;
      const parentOffsetTop = this.activeTooltipHost.offsetTop;
      const parentHeight = this.activeTooltipHost.offsetHeight;

      if (parentWindowOffsetTop < this.activeTooltip.offsetHeight) {
        this.setTooltipPlacements(
          this.activeTooltip,
          parentOffsetTop + parentHeight
        );
      } else {
        this.setTooltipPlacements(
          this.activeTooltip,
          parentOffsetTop - this.activeTooltip.offsetHeight
        );
      }
    }
  });
  removeTooltip() {
    const parent = this.render.parentNode(this.activeTooltip);
    this.render.removeChild(parent, this.activeTooltip);
    this.activeTooltip = null;
    this.activeTooltipHost = null;
  }
  public setTooltipPlacements(
    element: HTMLElement,
    top: number,
    left?: number
  ) {
    this.render.setStyle(element, "top", top + "px");
    if (left) this.render.setStyle(element, "left", left + "px");
  }
  constructor() {}
}
