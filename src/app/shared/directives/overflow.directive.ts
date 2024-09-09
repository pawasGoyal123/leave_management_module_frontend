import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTooltipOnOverflow]',
  standalone: true,
})
export class TooltipOnOverflowDirective {
  @Input('matTooltip') tooltipText: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.isOverflowing()) {
      this.el.nativeElement.setAttribute('matTooltip', this.tooltipText);
    } else {
      this.el.nativeElement.removeAttribute('matTooltip');
    }
  }

  private isOverflowing(): boolean {
    const element = this.el.nativeElement;
    return element.scrollWidth > element.clientWidth;
  }
}
