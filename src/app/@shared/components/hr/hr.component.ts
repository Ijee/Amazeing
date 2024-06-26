import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-hr',
    templateUrl: './hr.component.html',
    styleUrls: ['./hr.component.scss'],
    standalone: true
})
export class HrComponent {
    @Input() text: string;
    @Input() textSize: string;
    @Input() isUppercase: string;
    constructor() {}
}
