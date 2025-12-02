import { Directive, OnChanges, SimpleChanges, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appDisableControl]',
    standalone: true
})
export class DisableControlDirective implements OnChanges {
    private ngControl = inject(NgControl);

    readonly disableControl = input<boolean>(undefined);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['disableControl']) {
            const action = this.disableControl() ? 'disable' : 'enable';

            this.ngControl.control[action]();
        }
    }
}
