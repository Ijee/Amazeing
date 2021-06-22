import { Component, Input } from '@angular/core';
import { SimulationService } from '../../../@core/services/simulation.service';
import { SettingsService } from '../../../@core/services/settings.service';
import { RecordService } from '../../../@core/services/record.service';
import { StatRecord } from '../../../../types';
import { fadeInOutList } from '../../../@shared/animations/fadeInOutList';
import { transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
    animations: [
        fadeInOutList,
        trigger('blockInitialRenderAnimation', [transition(':enter', [])])
    ]
})
export class StatsComponent {
    @Input() isMouseDown: boolean;

    constructor(
        public simulationService: SimulationService,
        public recordService: RecordService,
        public settingsService: SettingsService
    ) {}

    trackByName(index: number, item: StatRecord): string {
        return item.name;
    }
}
