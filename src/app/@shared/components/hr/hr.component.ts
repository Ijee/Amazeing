import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-hr',
    templateUrl: './hr.component.html',
    styleUrls: ['./hr.component.scss']
})
export class HrComponent {
    @Input() text: string;

    constructor() {}
}
