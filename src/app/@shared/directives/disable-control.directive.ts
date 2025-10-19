import { Directive, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appDisableControl]',
    standalone: true
})
export class DisableControlDirective implements OnChanges {
    private ngControl = inject(NgControl);

    @Input() disableControl: boolean;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['disableControl']) {
            const action = this.disableControl ? 'disable' : 'enable';

            this.ngControl.control[action]();
        }
    }
}
