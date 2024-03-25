import { Component } from '@angular/core';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
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
    constructor(public readonly library: FaIconLibrary) {
        library.addIconPacks(fas, fab, far);
    }
}
