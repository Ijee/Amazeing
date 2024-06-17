import { AlgorithmOptionsComponent } from '../../../@shared/components/algorithm-options/algorithm-options.component';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '../../../@core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WarningDialogService } from '../../../@shared/components/warning-modal/warning-dialog.service';
import { SimulationService } from '../../../@core/services/simulation.service';
import { AlgorithmService } from '../../../@core/services/algorithm.service';
import { RecordService } from '../../../@core/services/record.service';
import { PathFindingAlgorithm } from '../../../@core/types/algorithm.types';
import { CommonModule, NgClass } from '@angular/common';
import { HrComponent } from 'src/app/@shared/components/hr/hr.component';
import { DisableControlDirective } from 'src/app/@shared/directives/disable-control.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-pathfinding-settings',
    templateUrl: './pathfinding-settings.component.html',
    styleUrls: ['./pathfinding-settings.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AlgorithmOptionsComponent,
        HrComponent,
        DisableControlDirective
    ]
})
export class PathfindingSettingsComponent implements OnInit, OnDestroy {
    private readonly destroyed$: Subject<void>;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly changeDetector: ChangeDetectorRef,
        private readonly warningDialog: WarningDialogService,
        public readonly recordService: RecordService,
        public readonly simulationService: SimulationService,
        public readonly algorithmService: AlgorithmService,
        public readonly settingsService: SettingsService
    ) {
        this.destroyed$ = new Subject<void>();
    }

    ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
            const pathFindingAlgorithms = new Set<PathFindingAlgorithm>([
                'A-Star',
                'IDA-Star',
                'Dijkstra',
                'Breadth-FS',
                'Depth-FS',
                'Best-FS',
                'Jump-PS',
                'Orthogonal-Jump-PS',
                'Wall-Follower',
                'Pledge',
                'Trémaux',
                'Dead-End-Filling',
                'Maze-Routing'
            ]);
            if (pathFindingAlgorithms.has(params.algorithm)) {
                this.algorithmService.setPathAlgorithm(params.algorithm);
            } else {
                this.router
                    .navigate(['.'], {
                        relativeTo: this.route,
                        queryParams: {
                            algorithm: this.algorithmService.getAlgorithmName()
                        }
                    })
                    .then(() => {
                        this.changeDetector.detectChanges();
                    });
            }
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * Handles the warning settings the user set and delegates the correct action accordingly.
     *
     * @param newAlgorithm - the new algorithm to be set
     */
    public handleWarning(newAlgorithm: PathFindingAlgorithm): void {
        if (this.recordService.getIteration() !== 0 && this.settingsService.getWarningsSetting()) {
            this.warningDialog.openDialog();
            this.warningDialog
                .afterClosed()
                .pipe(takeUntil(this.destroyed$))
                .subscribe((result) => {
                    if (result === 'continue') {
                        this.handleAlgorithmSwitch(newAlgorithm);
                    } else {
                        return;
                    }
                });
        } else {
            this.handleAlgorithmSwitch(newAlgorithm);
        }
    }

    /**
     * Switches the algorithm and appends the query param to the url.
     *
     * @param newAlgorithm - the new algorithm to be set
     */
    private handleAlgorithmSwitch(newAlgorithm: PathFindingAlgorithm): void {
        this.algorithmService.setPathAlgorithm(newAlgorithm);
        this.simulationService.setSimulationStatus(false);
        // TODO soft reset or hard reset / grid savepoint?
        this.simulationService.prepareGrid();
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { algorithm: newAlgorithm },
            queryParamsHandling: 'merge' // remove to replace all query params by provided
        });
    }

    /**
     * Sets the value of the diagonal movement checkbox on the service.
     *
     * Just exists because of the typing that will not work in the markup.
     * @param event the event
     */
    public handleDiagonalMovement(event: any): void {
        this.algorithmService.setDiagonalMovement(event.target.checked);
    }

    /**
     * Sets the value of the corner movement checkbox on the service.
     *
     * Just exists because of the typing that will not work in the markup.
     * @param event the event
     */
    public handleCornerMovement(event: any): void {
        this.algorithmService.setCornerMovement(event.target.checked);
    }
}
