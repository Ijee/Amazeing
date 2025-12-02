import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
    private _elementRef = inject(ElementRef);

    public readonly clickOutside = output<MouseEvent>();

    @HostListener('document:click', ['$event', '$event.target'])
    public onClick(event: MouseEvent, targetElement: EventTarget): void {
        if (!targetElement) {
            return;
        }

        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    }
}
