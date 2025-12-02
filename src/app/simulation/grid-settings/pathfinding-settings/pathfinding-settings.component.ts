import { AlgorithmOptionsComponent } from '../../../@shared/components/algorithm-options/algorithm-options.component';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, output } from '@angular/core';
import { SettingsService } from '../../../@core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SimulationService } from '../../../@core/services/simulation.service';
import { AlgorithmService } from '../../../@core/services/algorithm.service';
import { RecordService } from '../../../@core/services/record.service';
import { PathFindingAlgorithm } from '../../../@core/types/algorithm.types';
import { NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-pathfinding-settings',
    templateUrl: './pathfinding-settings.component.html',
    styleUrls: ['./pathfinding-settings.component.scss'],
    imports: [
        NgClass,
        FormsModule,
        ReactiveFormsModule,
        AlgorithmOptionsComponent,
        FaIconComponent,
        NgClass
    ]
})
export class PathfindingSettingsComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly changeDetector = inject(ChangeDetectorRef);
    protected readonly recordService = inject(RecordService);
    protected readonly simulationService = inject(SimulationService);
    protected readonly algorithmService = inject(AlgorithmService);
    protected readonly settingsService = inject(SettingsService);

    readonly switchAlgo = output<PathFindingAlgorithm>();

    private readonly destroyed$: Subject<void>;

    constructor() {
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
     * Emits an event to notify the grid-settingscomponent so that a warning can be
     * displayed in the parent component if necessary.
     *
     * @param newAlgo the new algorithm
     */
    public emitAlgorithmChange(newAlgo: PathFindingAlgorithm): void {
        this.switchAlgo.emit(newAlgo);
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
    public handleCrossCorners(event: any): void {
        this.algorithmService.setCrossCorners(event.target.checked);
    }
}
