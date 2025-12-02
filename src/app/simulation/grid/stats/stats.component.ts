import { Component, Input, afterRenderEffect, inject, signal } from '@angular/core';
import { SimulationService } from '../../../@core/services/simulation.service';
import { SettingsService } from '../../../@core/services/settings.service';
import { RecordService } from '../../../@core/services/record.service';
import { AlgorithmService } from '../../../@core/services/algorithm.service';
import { Statistic } from '../../../@core/types/algorithm.types';
import { CountAnimationDirective } from '../../../@shared/directives/count-animation.directive';
import { AsyncPipe } from '@angular/common';
import { BreakpointService } from 'src/app/@core/services/breakpoint.service';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
    imports: [CountAnimationDirective, AsyncPipe]
})
export class StatsComponent {
    @Input() isMouseDown: boolean;

    protected readonly simulationService = inject(SimulationService);
    protected readonly algorithmService = inject(AlgorithmService);
    protected readonly recordService = inject(RecordService);
    protected readonly settingsService = inject(SettingsService);
    protected readonly breakpointService = inject(BreakpointService);

    protected readonly animationsEnabled = signal(false);
    protected readonly statEnterAnimation = signal<string | null>(null);

    constructor() {
        afterRenderEffect(() => {
            const animationsEnabled = this.animationsEnabled();
            if (animationsEnabled) {
                this.statEnterAnimation.set('enter-animation');
            }
        });

        afterRenderEffect(() => {
            const staticData = this.algorithmService.getStatRecords();
            if (staticData != null) {
                this.animationsEnabled.set(true);
            }
        });
    }
    public trackByName(index: number, item: Statistic): string {
        return `stat-${index}-${item.name}`;
    }

    /**
     * Returns the css class for the grid position for a single
     * stat element the component.
     *
     * This is being done to enable the overlap
     * of the elements during their enter and leave animation and
     * prevent layout shifts.
     *
     * @param stat the stat to get the grid position for
     * @returns the appropriate css class
     */
    getGridPos(stat: Statistic): string {
        const stats = this.algorithmService
            .getStatRecords()
            .filter((stat) => stat.currentValue !== undefined);

        const index = stats.findIndex((s) => s == stat);

        switch (stats.length) {
            case 1:
                return 'gridPosSingle';
            case 2:
                return `gridPos2_${index + 1}`;
            case 3:
                return `gridPos3_${index + 1}`;
            default:
                return 'gridPosSingle';
        }
    }
}
