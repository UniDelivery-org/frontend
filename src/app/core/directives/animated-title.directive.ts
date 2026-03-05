import { Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[title]',
  standalone: true
})
export class AnimatedTitleDirective implements OnInit, OnDestroy {
  @Input('title') titleText: string = '';
  private tooltipElement: HTMLElement | null = null;
  private hideTimeout: any;
  private showTimeout: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.titleText) {
      this.renderer.removeAttribute(this.el.nativeElement, 'title');
    }
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) {
    if (!this.titleText) return;

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    if (this.tooltipElement) {
       this.hide();
    }
    
    this.showTimeout = setTimeout(() => {
        this.createTooltip();
    }, 200); 
  }

  createTooltip() {
    this.tooltipElement = this.renderer.createElement('div');
    const textNode = this.renderer.createText(this.titleText);
    this.renderer.appendChild(this.tooltipElement, textNode);

    this.renderer.addClass(this.tooltipElement, 'uni-animated-title');
    
    this.renderer.appendChild(document.body, this.tooltipElement);

    const rect = this.el.nativeElement.getBoundingClientRect();
    
    let top = rect.top - 38; 
    let left = rect.left + (rect.width / 2);

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);

    void this.tooltipElement!.offsetWidth;
    this.renderer.addClass(this.tooltipElement, 'uni-animated-title-visible');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hide();
  }

  @HostListener('click') onClick() {
    this.hide();
  }

  hide() {
    clearTimeout(this.showTimeout);
    if (this.tooltipElement) {
      this.renderer.removeClass(this.tooltipElement, 'uni-animated-title-visible');
      const el = this.tooltipElement;
      this.hideTimeout = setTimeout(() => {
        if (el && el.parentNode) {
          this.renderer.removeChild(document.body, el);
        }
      }, 200);
      this.tooltipElement = null;
    }
  }

  ngOnDestroy() {
    this.hide();
  }
}
