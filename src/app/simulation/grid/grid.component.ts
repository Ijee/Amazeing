import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    AfterViewInit,
    inject
} from '@angular/core';
import { SimulationService } from '../../@core/services/simulation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
import { AlgorithmService } from '../../@core/services/algorithm.service';
import { RecordService } from '../../@core/services/record.service';
import { GridLocation } from '../../@shared/classes/GridLocation';
import { Node } from '../../@core/types/algorithm.types';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HrComponent } from '../../@shared/components/hr/hr.component';
import { NodeComponent } from './node/node.component';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats/stats.component';
import { BreakpointService } from 'src/app/@core/services/breakpoint.service';

/**
 * ! Welcome to some of the most confusing code of the whole app.
 * I might have skipped the planning phase a bit here and there
 * and with constantly changing requirements it was bound to happen.
 * That's why I am now stuck with this beautiful code.
 *
 * I would just go somewhere else instead.
 * As always: blame @Ijee
 */
@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    imports: [CommonModule, StatsComponent, NodeComponent, HrComponent, FaIconComponent]
})
export class GridComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly changeDetector = inject(ChangeDetectorRef);
    protected readonly simulationService = inject(SimulationService);
    protected readonly recordService = inject(RecordService);
    protected readonly algorithmService = inject(AlgorithmService);
    protected readonly breakpointService = inject(BreakpointService);

    private readonly width: number;
    private readonly height: number;
    protected gridList: Node[][];
    protected isMouseDown: boolean;

    private readonly destroyed$: Subject<void>;

    constructor() {
        this.width = 47;
        this.height = 21;
        this.gridList = [];
        // init with no cells alive
        for (let i = 0; i < this.width; i++) {
            this.gridList[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.gridList[i][j] = { status: 0, weight: 1 };
            }
        }

        this.destroyed$ = new Subject<void>();
    }

    ngOnInit(): void {
        // set initial start and goal
        const initialStartX = Math.round((33 * this.width) / 100);
        const initialGoalX = Math.round((66 * this.width) / 100);
        const initialNodeHeightY = Math.round((50 * this.height) / 100);
        const startNode = this.gridList[initialStartX][initialNodeHeightY];
        startNode.status = 2;
        this.recordService.setGridStartLocation(
            new GridLocation(initialStartX, initialNodeHeightY, startNode.weight, startNode.status)
        );
        const goalNode = this.gridList[initialGoalX][initialNodeHeightY];
        goalNode.status = 3;
        this.recordService.setGridGoalLocation(
            new GridLocation(initialGoalX, initialNodeHeightY, goalNode.weight, goalNode.status)
        );
        this.simulationService.setGridList(this.gridList);
        // this.recordService.setAlgoStat1(this.width * this.height);
        this.simulationService
            .getGridList()
            .pipe(takeUntil(this.destroyed$))
            .subscribe((data) => {
                if (data.length) {
                    data.forEach((column, i) => {
                        column.forEach((cell, j) => {
                            this.setCell(i, j, cell);
                        });
                    });
                } else {
                    this.reset();
                }
            });
        // this.changeDetector.detectChanges();
    }

    ngAfterViewInit() {
        // TODO Same as grid-settings component
        this.changeDetector.detectChanges();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * Is responsible for creating a tick onMouseUp so you can
     * reverse it with a backward step
     */
    onMouseUp(): void {
        if (this.isMouseDown) {
            this.isMouseDown = false;
            switch (this.simulationService.getDrawingMode()) {
                case 0:
                case 1:
                    this.simulationService.setSavePoint(cloneDeep(this.gridList));
                    break;
                case 2:
                case 3:
                    this.simulationService.setSavePoint(cloneDeep(this.gridList));
                    break;
            }
            this.simulationService.setDrawingMode(-1);
        }
    }

    /**
     * Determines the new node status and drawing logic when clicking or
     * holding on the grid.
     *
     * @param col the selected column
     * @param row the selected row
     */
    drawModeLogic(col: number, row: number): void {
        const node = this.gridList[col][row];
        const oldStatus = node.status;
        let drawMode = this.simulationService.getDrawingMode();
        if (drawMode < 0) {
            if (oldStatus === 1) {
                drawMode = 0;
            } else {
                drawMode = 1;
            }
            this.simulationService.setDrawingMode(drawMode);
        }
        if (oldStatus === 2 || oldStatus === 3 || oldStatus === drawMode) {
            return;
        }
        node.status = drawMode;

        let changeNode: GridLocation;
        switch (drawMode) {
            case 2:
                changeNode = this.recordService.getGridStartLocation();
                this.gridList[changeNode.x][changeNode.y].status = 0;
                // This was probably bad before
                // const startLocation = this.recordService.getGridStartLocation();
                // const startNode = this.gridList[startLocation.x][startLocation.y];
                // startNode.status = 0;
                this.recordService.setGridStartLocation(
                    new GridLocation(col, row, node.weight, node.status)
                );
                this.onMouseUp();
                break;
            case 3:
                changeNode = this.recordService.getGridGoalLocation();
                this.gridList[changeNode.x][changeNode.y].status = 0;
                // const goalLocation = this.recordService.getGridGoalLocation();
                // const goalNode = this.gridList[goalLocation.x][goalLocation.y];
                // goalNode.status = 0;
                this.recordService.setGridGoalLocation(
                    new GridLocation(col, row, node.weight, node.status)
                );
                this.onMouseUp();
                break;
            default:
                break;
        }
    }

    /**
     * Changes the 'nodeStatus' object property
     * of a specific cell to the one requested
     * in the param.
     *
     * @param x - the x position
     * @param y - the y position
     * @param node - the node
     */
    public setCell(x: number, y: number, node: Node): void {
        const cell = this.gridList[x][y];
        cell.status = node.status;
        cell.weight = node.weight;
        cell.text = node.text;
    }

    /**
     * Add random node weights between 0 - 9 to each node in the grid
     * and then saves it to the service.
     */
    public addNodeWeights(): void {
        this.gridList.forEach((column) => {
            column.forEach((node) => {
                node.weight = Math.floor(Math.random() * 9 + 1);
            });
        });
        if (!this.simulationService.getShowWeightStatus()) {
            this.simulationService.toggleWeightStatus();
        }
        this.simulationService.setSavePoint(cloneDeep(this.gridList));
    }

    /**
     * Resets all gridList cells back to the
     * start value.
     */
    private reset(): void {
        this.gridList.forEach((column) => {
            column.forEach((node) => {
                node.status = 0;
                node.weight = 1;
                delete node.text;
            });
        });
        const startLocation = this.recordService.getGridStartLocation();
        this.gridList[startLocation.x][startLocation.y].status = 2;
        const goalLocation = this.recordService.getGridGoalLocation();
        this.gridList[goalLocation.x][goalLocation.y].status = 3;
        this.simulationService.setGridList(this.gridList);
    }
}
