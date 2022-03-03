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
    public handleWarning(algoMode: AlgorithmMode, skipWarning: boolean): void {
        if (this.algorithmService.getAlgorithmMode() !== algoMode) {
            if (this.settingsService.getWarningsSetting() && !skipWarning) {
                this.showWarning = true;
            } else {
                this.simulationService.prepareGrid();
                this.algorithmService.setAlgorithmMode(algoMode);
                this.showWarning = false;
                // TODO does this work after algorithm service changes???

                this.router.navigate([algoMode], {
                    relativeTo: this.route,
                    queryParams: {
                        algorithm: this.algorithmService.getAlgorithmName()
                    }
                });
                // console.log('algoMode in service', this.settingsService.getAlgorithmMode());
            }
        }
    }

    /**
     * Returns the other algoMode based on the one it is currently set to.
     */
    public switchToOtherMode(): AlgorithmMode {
        return this.algorithmService.getAlgorithmMode() === 'maze'
            ? 'path-finding'
            : 'maze';
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
