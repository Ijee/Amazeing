import { Component, Input, inject } from '@angular/core';
import { SimulationService } from '../../../@core/services/simulation.service';
import { SettingsService } from '../../../@core/services/settings.service';
import { RecordService } from '../../../@core/services/record.service';
import { fadeInOutList } from '../../../@shared/animations/fadeInOutList';
import { transition, trigger } from '@angular/animations';
import { AlgorithmService } from '../../../@core/services/algorithm.service';
import { Statistic } from '../../../@core/types/algorithm.types';
import { CountAnimationDirective } from '../../../@shared/directives/count-animation.directive';
import { CommonModule } from '@angular/common';
import { BreakpointService } from 'src/app/@core/services/breakpoint.service';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
    animations: [fadeInOutList, trigger('blockInitialRenderAnimation', [transition(':enter', [])])],
    imports: [CommonModule, CountAnimationDirective]
})
export class StatsComponent {
    readonly simulationService = inject(SimulationService);
    readonly algorithmService = inject(AlgorithmService);
    readonly recordService = inject(RecordService);
    readonly settingsService = inject(SettingsService);
    readonly breakpointService = inject(BreakpointService);

    @Input() isMouseDown: boolean;

    public trackByName(index: number, item: Statistic): string {
        return item.name;
    }
}
