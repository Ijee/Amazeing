import { Component } from '@angular/core';
import { HrComponent } from '../../@shared/components/hr/hr.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-learn-prims',
    templateUrl: './learn-prims.component.html',
    styleUrls: ['./learn-prims.component.scss'],
    imports: [FaIconComponent, HrComponent]
})
export class LearnPrimsComponent {
    constructor() {}
}
