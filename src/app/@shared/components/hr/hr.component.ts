import { Component, input } from '@angular/core';

@Component({
    selector: 'app-hr',
    templateUrl: './hr.component.html',
    styleUrls: ['./hr.component.scss'],
    standalone: true
})
export class HrComponent {
    readonly text = input<string>(undefined);
    readonly textSize = input<string>(undefined);
    readonly isUppercase = input<string>(undefined);
    constructor() {}
}
