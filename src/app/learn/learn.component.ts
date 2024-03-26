import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LearnPrimsComponent } from './learn-prims/learn-prims.component';
import { HrComponent } from '../@shared/components/hr/hr.component';

@Component({
    selector: 'app-learn',
    templateUrl: './learn.component.html',
    styleUrls: ['./learn.component.scss'],
    standalone: true,
    imports: [FaIconComponent, HrComponent, LearnPrimsComponent]
})
export class LearnComponent {
    constructor() {}
}
