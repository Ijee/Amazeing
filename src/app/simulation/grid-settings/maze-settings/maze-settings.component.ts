import { AlgorithmOptionsComponent } from '../../../@shared/components/algorithm-options/algorithm-options.component';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { SettingsService } from '../../../@core/services/settings.service';
import { AlgorithmService } from '../../../@core/services/algorithm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SimulationService } from '../../../@core/services/simulation.service';
import { RecordService } from '../../../@core/services/record.service';
import { MazeAlgorithm } from '../../../@core/types/algorithm.types';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-maze-settings',
    templateUrl: './maze-settings.component.html',
    styleUrls: ['./maze-settings.component.scss'],
    standalone: true,
    imports: [NgClass, AlgorithmOptionsComponent]
})
export class MazeSettingsComponent implements OnInit, OnDestroy {
    // protected readonly SimulationService = SimulationService;

    @Output() switchAlgo = new EventEmitter();

    private readonly destroyed$: Subject<void>;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly changeDetector: ChangeDetectorRef,
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
                'Cellular-Automaton'
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

    public emitAlgorithmChange(newAlgo: MazeAlgorithm): void {
        this.switchAlgo.emit(newAlgo);
    }
}
