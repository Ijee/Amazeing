import { Component, OnDestroy } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { SettingsService } from '../../@core/services/settings.service';
import { SimulationService } from '../../@core/services/simulation.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AlgorithmService } from '../../@core/services/algorithm.service';
import { Subject } from 'rxjs';
import { fadeAnimationSafe } from '../../@shared/animations/fadeRouteAnimation';
import { AlgorithmMode } from '../../../types';
import { RecordService } from '../../@core/services/record.service';

@Component({
    selector: 'app-grid-settings',
    templateUrl: './grid-settings.component.html',
    styleUrls: ['./grid-settings.component.scss'],
    animations: [fadeAnimationSafe]
})
export class GridSettingsComponent implements OnDestroy {
    public showWarning: boolean;

    private readonly destroyed$: Subject<void>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private library: FaIconLibrary,
        private recordService: RecordService,
        public algorithmService: AlgorithmService,
        public simulationService: SimulationService,
        public settingsService: SettingsService
    ) {
        library.addIconPacks(fas, fab, far);

        this.showWarning = false;
        // activates the right algorithm mode button based on the matched url
        if (this.router.url.includes('maze')) {
            this.algorithmService.setAlgorithmMode('maze');
        } else {
            this.algorithmService.setAlgorithmMode('path-finding');
        }

        this.destroyed$ = new Subject<void>();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * This switches to the other algorithm mode and handles the warning shown to the client
     *
     * @param algoMode - the new algorithm mode to be set
     * @param skipWarning - whether or not to skip the warning or not
     */
    public handleWarning(algoMode: AlgorithmMode): void {
        if (this.algorithmService.getAlgorithmMode() !== algoMode) {
            if (
                this.recordService.getIteration() === 0 ||
                !this.settingsService.getWarningsSetting()
            ) {
                this.switchToOtherMode(algoMode);
            } else {
                this.showWarning = true;
            }
        }
    }

    /**
     * Returns the other algoMode based on the one it is currently set to.
     */
    public switchToOtherMode(algoMode: AlgorithmMode): void {
        this.showWarning = false;
        this.simulationService.prepareGrid();

        if (this.algorithmService.getAlgorithmMode() === 'maze') {
            this.algorithmService.setAlgorithmMode('path-finding');
        } else {
            this.algorithmService.setAlgorithmMode('maze');
        }

        this.router.navigate([this.algorithmService.getAlgorithmMode()], {
            relativeTo: this.route.parent,
            queryParams: {
                algorithm: this.algorithmService.getAlgorithmName()
            }
        });
    }

    /**
     * Navigates to the /learn route with the current selected algorithm as a query param.
     */
    public navigateToLearn(): void {
        this.router.navigate(['/learn'], {
            queryParams: { algorithm: this.algorithmService.getAlgorithmName() }
        });
    }
}
