import { MazeAlgorithm, PathFindingAlgorithm } from './../../@core/types/algorithm.types';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    Renderer2
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SettingsService } from '../../@core/services/settings.service';
import { SimulationService } from '../../@core/services/simulation.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AlgorithmService } from '../../@core/services/algorithm.service';
import { Subject, takeUntil } from 'rxjs';
import { fadeAnimationSafe } from '../../@shared/animations/fadeRouteAnimation';
import { RecordService } from '../../@core/services/record.service';
import { AlgorithmMode } from '../../@core/types/algorithm.types';
import { CommonModule, DOCUMENT, NgClass, UpperCasePipe } from '@angular/common';
import { HrComponent } from '../../@shared/components/hr/hr.component';
import { BreakpointService } from 'src/app/@core/services/breakpoint.service';
import { MazeSettingsComponent } from './maze-settings/maze-settings.component';
import { PathfindingSettingsComponent } from './pathfinding-settings/pathfinding-settings.component';

@Component({
    selector: 'app-grid-settings',
    templateUrl: './grid-settings.component.html',
    styleUrls: ['./grid-settings.component.scss'],
    animations: [fadeAnimationSafe],
    imports: [CommonModule, HrComponent, NgClass, FaIconComponent, RouterOutlet]
})
export class GridSettingsComponent implements AfterViewInit, OnDestroy {
    public showWarning: boolean;
    public transitionName: 'toMaze' | 'toPath' | 'disableTransition';
    public newAlgorithm: MazeAlgorithm | PathFindingAlgorithm;

    private readonly destroyed$: Subject<void>;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly ref: ChangeDetectorRef,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document,
        public readonly recordService: RecordService,
        public readonly algorithmService: AlgorithmService,
        public readonly simulationService: SimulationService,
        public readonly settingsService: SettingsService,
        public readonly breakpointService: BreakpointService
    ) {
        this.destroyed$ = new Subject<void>();
        this.showWarning = false;
        // activates the right algorithm mode button based on the matched url
        if (this.router.url.includes('maze')) {
            this.algorithmService.setAlgorithmMode('maze');
        } else {
            this.algorithmService.setAlgorithmMode('path-finding');
        }

        this.simulationService
            .getHandleImport()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.navigateMode();
            });
    }

    ngAfterViewInit() {
        // TODO Maybe fix following problem since Angular 16
        // Fixes ExpressionChangedAfterItHasBeenCheckedError for the loading animation.
        // Don't ask me why though.
        this.ref.detectChanges();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * Subscirbes to idential events on the maze-settings or pathfinding-settings component.
     *
     * TODO: as I am writing this code I already know that this needs a refactor. It jut had to work for now.
     * @param componentRef
     */
    public subscribeToEmitter(componentRef) {
        if (
            !(componentRef instanceof MazeSettingsComponent) ||
            !(componentRef instanceof PathfindingSettingsComponent)
        ) {
            const child = componentRef;
            child.switchAlgo.subscribe((val: MazeAlgorithm | PathFindingAlgorithm) => {
                this.newAlgorithm = val;
                this.handleWarning();
            });
        }
    }

    public delegateSwitch(): void {
        if (this.newAlgorithm) {
            this.switchAlgorithm();
        } else {
            this.switchAlgoMode();
        }
    }

    /**
     * This switches to the other algorithm mode and handles the warning shown to the client
     *
     * @param algoMode - the new algorithm mode to be set
     */
    public handleWarning(algoMode?: AlgorithmMode): void {
        if (this.algorithmService.getAlgorithmMode() !== algoMode) {
            if (
                this.recordService.getIteration() === 0 ||
                !this.settingsService.getWarningsSetting()
            ) {
                if (this.newAlgorithm) {
                    this.switchAlgorithm();
                } else {
                    this.switchAlgoMode();
                }
            } else {
                this.showWarning = true;
            }
        }
    }

    /**
     * Returns the other algoMode based on the one it is currently set to.
     */
    public switchAlgoMode(): void {
        this.showWarning = false;
        this.simulationService.setSimulationStatus(false);
        this.simulationService.prepareGrid();
        if (this.algorithmService.getAlgorithmMode() === 'maze') {
            this.algorithmService.setAlgorithmMode('path-finding');
        } else {
            this.algorithmService.setAlgorithmMode('maze');
        }

        this.navigateMode();
    }

    public navigateMode(): void {
        this.transitionName =
            this.algorithmService.getAlgorithmMode() === 'maze' ? 'toPath' : 'toMaze';
        const rootElement = this.document.documentElement; // Target the root element
        this.renderer.addClass(rootElement, 'no-root-view-transition');

        if (!this.settingsService.getAnimationsSetting()) {
            this.transitionName = undefined;
        }

        setTimeout(() => {
            this.router
                .navigate([this.algorithmService.getAlgorithmMode()], {
                    relativeTo: this.route.parent,
                    queryParams: {
                        algorithm: this.algorithmService.getAlgorithmName()
                    }
                })
                .finally(() => {
                    // remove class after it is done
                    setTimeout(() => {
                        this.transitionName = undefined;

                        this.renderer.removeClass(rootElement, 'no-root-view-transition');
                    }, 10); // Ensure the class is removed after the navigation has completed
                });
        }, 10); // Delay to ensure the class is applied before the transition
    }

    /**
     * Navigates to the /learn route with the current selected algorithm as a query param.
     */
    public navigateToLearn(): void {
        this.router.navigate(['/learn'], {
            queryParams: { algorithm: this.algorithmService.getAlgorithmName() }
        });
    }

    /**
     * Switches the algorithm and appends the query param to the url.
     *
     */
    private switchAlgorithm(): void {
        if (this.algorithmService.getAlgorithmMode() === 'maze') {
            this.algorithmService.setMazeAlgorithm(this.newAlgorithm as MazeAlgorithm);
        } else {
            this.algorithmService.setPathAlgorithm(this.newAlgorithm as PathFindingAlgorithm);
        }
        this.simulationService.setSimulationStatus(false);
        this.simulationService.prepareGrid();

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { algorithm: this.newAlgorithm },
            queryParamsHandling: 'merge' // remove to replace all query params by provided
        });
        this.newAlgorithm = undefined;
        this.showWarning = false;
    }
}
