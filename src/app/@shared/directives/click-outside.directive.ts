import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
    constructor(private _elementRef: ElementRef) {}

    @Output()
    public clickOutside = new EventEmitter();

    @HostListener('document:click', ['$event', '$event.target'])
    public onClick(event: MouseEvent, targetElement: HTMLElement): void {
        if (!targetElement) {
            return;
        }

        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    }
}
