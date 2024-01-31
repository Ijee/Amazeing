import { Component, Input } from '@angular/core';
import { SimulationService } from '../../../@core/services/simulation.service';
import { SettingsService } from '../../../@core/services/settings.service';
import { RecordService } from '../../../@core/services/record.service';
import { fadeInOutList } from '../../../@shared/animations/fadeInOutList';
import { transition, trigger } from '@angular/animations';
import { AlgorithmService } from '../../../@core/services/algorithm.service';
import { StatRecord } from '../../../@core/types/algorithm.types';
import { CountAnimationDirective } from '../../../@shared/directives/count-animation.directive';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
    animations: [fadeInOutList, trigger('blockInitialRenderAnimation', [transition(':enter', [])])],
    standalone: true,
    imports: [CountAnimationDirective]
})
export class StatsComponent {
    @Input() isMouseDown: boolean;

    constructor(
        public simulationService: SimulationService,
        public algorithmService: AlgorithmService,
        public recordService: RecordService,
        public settingsService: SettingsService
    ) {}

    public trackByName(index: number, item: StatRecord): string {
        return item.name;
    }
}
