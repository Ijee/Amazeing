import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '../../../@core/services/settings.service';
import { AlgorithmService } from '../../../@core/services/algorithm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WarningDialogService } from '../../../@shared/components/warning-modal/warning-dialog.service';
import { SimulationService } from '../../../@core/services/simulation.service';
import { RecordService } from '../../../@core/services/record.service';
import { MazeAlgorithm } from '../../../@core/types/algorithm.types';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-maze-settings',
    templateUrl: './maze-settings.component.html',
    styleUrls: ['./maze-settings.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class MazeSettingsComponent implements OnInit, OnDestroy {
    // protected readonly SimulationService = SimulationService;

    private readonly destroyed$: Subject<void>;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly changeDetector: ChangeDetectorRef,
        private readonly warningDialog: WarningDialogService,
        public readonly recordService: RecordService,
        public readonly simulationService: SimulationService,
        public readonly settingsService: SettingsService,
        public readonly algorithmService: AlgorithmService
    ) {
        this.destroyed$ = new Subject<void>();
    }

    ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
            const pathFindingAlgorithms = new Set<MazeAlgorithm>([
                'Prims',
                'Kruskals',
                'Aldous-Broder',
                'Wilsons',
                'Ellers',
                'Sidewinder',
                'Hunt-and-Kill',
                'Growing-Tree',
                'Binary-Tree',
                'Recursive-Backtracking',
                'Recursive-Division',
                'Cellular-Automation'
            ]);
            if (pathFindingAlgorithms.has(params.algorithm)) {
                this.algorithmService.setMazeAlgorithm(params.algorithm);
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

    public handleWarning(newAlgorithm: MazeAlgorithm): void {
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
    private handleAlgorithmSwitch(newAlgorithm: MazeAlgorithm): void {
        this.algorithmService.setMazeAlgorithm(newAlgorithm);
        this.simulationService.setSimulationStatus(false);
        // TODO soft reset or hard reset / grid savepoint?
        this.simulationService.prepareGrid();
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { algorithm: newAlgorithm },
            queryParamsHandling: 'merge' // remove to replace all query params by provided
        });
    }
}
