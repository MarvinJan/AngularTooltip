import {
  Directive,
  OnInit,
  ElementRef,
  HostListener,
  Renderer2,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { TooltipService } from "./tooltip.service";

@Directive({
  selector: "[appTooltip]"
})
export class TooltipDirective implements OnInit {
  constructor(
    private render: Renderer2,
    private el: ElementRef,
    private tooltipService: TooltipService
  ) {
    /* pass renderer to service to be able to remove tooltip on document.click event;
    can't do it from the directive itself since HostListener triggers for all instances
    and one always returns 'true' on tooltip click removing the tooltip  */
    this.tooltipService.render = this.render;
  }

  @Input() tooltipText: string;
  @Output() test = new EventEmitter();

  tooltip: HTMLElement = null;
  clickedElement: HTMLElement = this.el.nativeElement;
  parent: HTMLElement = this.render.parentNode(this.clickedElement);
  tooltipStyles: {} = {
    position: "absolute",
    background: "#000c",
    color: "#fffc",
    padding: "5px 10px",
    visibility: "hidden", // needed to get tooltip height and set it's placement before user sees it
    "z-index": "99"
  };
  tooltipStylesString: string = Object.keys(this.tooltipStyles).reduce(
    (a, b) => {
      return a + `${b}: ${this.tooltipStyles[b]};`;
    },
    ""
  );

  @HostListener("click") displayTooltip() {
    const activeTooltip = this.tooltipService.activeTooltip;

    if (activeTooltip !== null && activeTooltip !== this.tooltip) {
      const activeTooltipParent = this.render.parentNode(activeTooltip);
      this.render.removeChild(activeTooltipParent, activeTooltip);
      this.tooltip = null;
    }

    if (activeTooltip !== null && activeTooltip === this.tooltip) return false;

    this.tooltip = this.formTooltipElement();
    this.render.insertBefore(this.parent, this.tooltip, this.clickedElement);
    this.tooltipService.setTooltipPlacements(
      this.tooltip,
      this.clickedElement.offsetTop - this.tooltip.offsetHeight,
      this.clickedElement.offsetLeft +
        this.clickedElement.offsetWidth / 2 -
        this.tooltip.offsetWidth / 2
    );
    this.render.setStyle(this.tooltip, "visibility", "visible"); // placements set - showing the tooltip
    this.tooltipService.activeTooltip = this.tooltip;
    this.tooltipService.activeTooltipHost = this.clickedElement;
  }

  formTooltipElement() {
    const tooltipElement = this.render.createElement("div");
    this.render.setAttribute(tooltipElement, "style", this.tooltipStylesString);
    const tooltipText = this.render.createText(this.tooltipText);
    this.render.appendChild(tooltipElement, tooltipText);
    return tooltipElement;
  }

  checkForTopSpace(element: HTMLElement, tooltipHeight: number) {
    return element.offsetTop <= tooltipHeight;
  }

  ngOnInit() {}
}
