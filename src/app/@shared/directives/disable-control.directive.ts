import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';

@Directive({
    selector: '[appDisableControl]',
    standalone: true
})
export class DisableControlDirective implements OnChanges {
    @Input() disableControl: boolean;

    constructor(private ngControl: NgControl) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['disableControl']) {
            const action = this.disableControl ? 'disable' : 'enable';

            this.ngControl.control[action]();
        }
    }
}
