import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appDisableControl]',
    standalone: true
})
export class DisableControlDirective {
    @Input() disableControl;

    constructor(private ngControl: NgControl) {}

    ngOnChanges(changes) {
        if (changes['disableControl']) {
            const action = this.disableControl ? 'disable' : 'enable';

            this.ngControl.control[action]();
        }
    }
}
