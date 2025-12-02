import { Session } from './../types/algorithm.types';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { cloneDeep } from 'lodash-es';
import * as pako from 'pako';
import { SettingsService } from './settings.service';
import { AlgorithmService } from './algorithm.service';
import { RecordService } from './record.service';
import { MazeAlgorithm, Node, PathFindingAlgorithm, Statistic } from '../types/algorithm.types';
import { AlgorithmOptions } from '../types/jsonform.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';

@Injectable({
    providedIn: 'root'
})
export class SimulationService {
    private settingsService = inject(SettingsService);
    private recordService = inject(RecordService);
    private algorithmService = inject(AlgorithmService);

    private readonly gridList$: BehaviorSubject<Node[][]>;

    private drawingMode: number;
    private simulationSpeed: number;
    private isSimulationActive: boolean;
    private disablePlay: boolean;
    private backwardStepsAmount: number;
    private showWeightStatus: boolean;
    private readonly patchFormValues$: Subject<AlgorithmOptions>;
    private showLegendModal: boolean;
    private showImportModal: boolean;
    private showExportModal: boolean;
    private exportToken: string;
    private readonly handleImport$: Subject<void>;
    private intervalID: number;

    constructor() {
        this.gridList$ = new BehaviorSubject<Node[][]>([]);
        this.drawingMode = -1;
        this.simulationSpeed = 100;
        this.disablePlay = false;
        this.isSimulationActive = false;
        this.backwardStepsAmount = 0;
        this.patchFormValues$ = new Subject<AlgorithmOptions>();
        this.showLegendModal = false;
        this.showImportModal = false;
        this.showExportModal = false;
        this.handleImport$ = new Subject<void>();
    }

    /**
     * Adds a new history step to create a new algorithm record.
     * @param gridList the gridList to be saved
     * @private
     */
    private updateRecords(gridList: Node[][]) {
        const state = cloneDeep(this.algorithmService.getCurrentAlgorithmState());
        const statRecord = cloneDeep(this.algorithmService.getStatRecords());
        const grid = cloneDeep(gridList);
        this.recordService.addHistoryStep(grid, state, statRecord);
        this.gridList$.next(grid);
    }

    /**
     * Determines the new speed to be set based on upper and lower bounds
     *
     * @param speed - the new speed to be set
     * @private
     */
    private setSimulationSpeed(speed: number): void {
        this.simulationSpeed = this.simulationSpeed + speed;
        if (this.simulationSpeed < 20) {
            this.simulationSpeed = 20;
        } else if (this.simulationSpeed > 500) {
            this.simulationSpeed = 500;
        }
    }

    /**
     * Restarts the current interval that
     * is used to call the updateMessage method.
     */
    private restartInterval(): void {
        clearInterval(this.intervalID);
        if (this.isSimulationActive) {
            this.intervalID = window.setInterval(
                () => this.stepForward(),
                10000 / this.simulationSpeed
            );
        }
    }

    /**
     * Changes the backwardsStepAmount.
     * @param value - the new value to be added
     * @private
     */
    private changeBackwardStepsAmount(value: number): void {
        this.backwardStepsAmount = this.backwardStepsAmount + value;
    }

    /**
     * creates a new iteration and everything that is needed
     * for the iteration to continue.
     */
    public stepForward(): void {
        if (this.recordService.getIteration() === 0) {
            this.algorithmService.setInitialData(
                cloneDeep(this.gridList$.getValue()),
                this.recordService.getGridStartLocation(),
                this.recordService.getGridGoalLocation()
            );
        }
        const newGrid = this.algorithmService.getNextStep();
        if (newGrid) {
            this.recordService.setIteration(this.recordService.getIteration() + 1);
            if (this.recordService.tryHistoryStepForward()) {
                const { grid, state, statRecord } = cloneDeep(
                    this.recordService.getCurrentHistoryStep()
                );
                this.algorithmService.updateAlgorithmState(grid, state, statRecord);
                this.gridList$.next(grid);
            } else {
                this.updateRecords(newGrid);
            }
        } else {
            this.setDisablePlay(true);
            this.setSimulationStatus();
            this.settingsService.setUserTourTaken(true);
        }
        if (this.backwardStepsAmount < RecordService.MAX_SAVE_STEPS - 1) {
            this.changeBackwardStepsAmount(1);
        }
    }

    /**
     * Responsible for the backwardStep.
     */
    public stepBackwards(): void {
        if (this.isSimulationActive) {
            this.isSimulationActive = false;
            this.restartInterval();
        }
        if (this.backwardStepsAmount > 0) {
            this.changeBackwardStepsAmount(-1);
            this.setDisablePlay(false);
            // this.recordService.manipulateHistory();
            this.recordService.setIteration(this.recordService.getIteration() - 1);
            this.recordService.historyStepBackwards();
            const { grid, state, statRecord } = cloneDeep(
                this.recordService.getCurrentHistoryStep()
            );
            this.algorithmService.updateAlgorithmState(grid, state, statRecord);
            this.gridList$.next(grid);
        }
    }

    /**
     * Completes the current algorithm fully.
     */
    public completeAlgorithm(): void {
        this.setSimulationStatus(false);
        this.setDisablePlay(true);
        this.settingsService.setUserTourTaken(true);
        if (this.recordService.getIteration() === 0) {
            this.algorithmService.setInitialData(
                this.gridList$.getValue(),
                this.recordService.getGridStartLocation(),
                this.recordService.getGridGoalLocation()
            );
        }
        const [iterationCount, newGrid] = this.algorithmService.completeAlgorithm();
        this.recordService.setIteration(this.recordService.getIteration() + iterationCount);
        this.updateRecords(newGrid);
        if (this.backwardStepsAmount < RecordService.MAX_SAVE_STEPS - 1) {
            this.changeBackwardStepsAmount(1);
        }
    }

    /**
     * This resets the grid and everything associated with it.
     * First resets does a reset to the grid save point.
     * Second one does a hard reset
     */
    public reset(): void {
        this.setSimulationStatus(false);
        this.setDisablePlay(false);
        if (this.recordService.getIteration() > 0) {
            // const gridSavepoint = this.recordService.getGridSavePoint();
            // Resets to save point
            this.recordService.setIteration(0);
            this.recordService.resetHistory();
            this.gridList$.next(this.recordService.getGridSavePoint());
            // this resets the statrecords currentValues backto 0
            if (this.algorithmService.getAlgorithmMode() === 'maze') {
                this.algorithmService.setMazeAlgorithm(
                    this.algorithmService.getAlgorithmName() as MazeAlgorithm
                );
            } else {
                this.algorithmService.setPathAlgorithm(
                    this.algorithmService.getAlgorithmName() as PathFindingAlgorithm
                );
            }
            // this.gridList$.next(this.recordService.getGridSavePoint());
        } else {
            // Hard reset
            this.recordService.setIteration(0);
            this.gridList$.next([]);
            this.recordService.setGridSavePoint([]);
        }
        this.exportToken = '';
        this.backwardStepsAmount = 0;
    }

    /**
     * This prepares or rather removes algorithm specific grid states and stats
     */
    public prepareGrid(): void {
        // deletes all the algorithm specific nodes from the grid
        const grid = cloneDeep(this.gridList$.value);
        const useWeights = this.algorithmService.usesNodeWeights();
        grid.forEach((column) => {
            column.forEach((node) => {
                const status = node.status;
                // Remove algorithm specific node statuses.
                if (status > 3) {
                    node.status = 0;
                }
                // Reset node weights when the current algorithm won't use them.
                if (!useWeights) {
                    node.weight = 1;
                }
                if (Object.hasOwn(node, 'text')) {
                    delete node.text;
                }
            });
        });
        this.gridList$.next(grid);
        this.setDisablePlay(false);
        this.recordService.setIteration(0);
        this.backwardStepsAmount = 0;
        this.recordService.setGridSavePoint(grid);
    }

    /**
     * Sets a new gridList as the current gridList
     *
     * @param newGrid - the new gridList
     */
    public setGridList(newGrid: Node[][]): void {
        const grid = cloneDeep(newGrid);
        this.recordService.addEmptyHistoryStep(grid);
        this.gridList$.next(grid);
    }

    /**
     * Determines the new simulation status to be either active or inactive
     *
     * @param status - the new status to be set and if not given will negate the current status
     */
    public setSimulationStatus(status?: boolean): void {
        if (status !== undefined) {
            this.isSimulationActive = status;
        } else {
            this.isSimulationActive = !this.isSimulationActive;
        }
        this.restartInterval();
    }

    /**
     * Tries to set all the important information for the new session.
     *
     * @param importText - the new session to be used
     */
    public importSession(importText: string): void {
        const oldAlgoMode = this.algorithmService.getAlgorithmMode();
        let session: Session;

        try {
            const uint8arr = Uint8Array.from(importText.split(',').map((str) => parseInt(str, 10)));
            session = JSON.parse(pako.inflate(uint8arr, { to: 'string' }));
            // Hi from the past. Nice seeing you again.
            // console.log('session', session);
            if (session.version !== 1) {
                throw new Error(
                    'This import token can not be imported in this version of the app. ' +
                        'Version needed: ' +
                        session.version +
                        '.x'
                );
            }

            this.algorithmService.setAlgorithmMode(session.algorithmMode);
            if (this.algorithmService.getAlgorithmMode() === 'maze') {
                this.algorithmService.setMazeAlgorithm(session.algorithm as MazeAlgorithm);
            } else {
                this.algorithmService.setPathAlgorithm(session.algorithm as PathFindingAlgorithm);
                this.algorithmService.setHeuristic(session.heuristic);
                this.algorithmService.setDiagonalMovement(
                    session.pathFindingSettings.cornerMovement
                );
                this.algorithmService.setCrossCorners(session.pathFindingSettings.cornerMovement);
                this.algorithmService.updatePathfindingSettings();
                // console.log('I just set the pathfindings settings');
            }
            // console.log('session import', session);
            if (session.iteration !== 0) {
                this.algorithmService.updateAlgorithmState(
                    session.grid,
                    session.state,
                    session.stats,
                    true
                );
            }

            this.recordService.setIteration(session.iteration);
            this.recordService.resetHistory();
            const newStartLoc = new GridLocation(
                session.startLoc.x,
                session.startLoc.y,
                session.startLoc.weight,
                session.startLoc.status
            );
            const newGoalLoc = new GridLocation(
                session.goalLoc.x,
                session.goalLoc.y,
                session.goalLoc.weight,
                session.goalLoc.status
            );
            this.recordService.setGridStartLocation(newStartLoc);
            this.recordService.setGridGoalLocation(newGoalLoc);
            this.algorithmService.setGoalLocation(newGoalLoc);
            // TODO setOptions doesn't really do anything here and I am not sure
            // if this is the best way to patch the values.
            this.algorithmService.setOptions(session.options);

            if (oldAlgoMode !== session.algorithmMode) {
                // console.log('navigating to other mode');
                this.handleImport$.next();
            }

            // console.log('patchFormValue', this.patchFormValues$.value);

            this.gridList$.next(session.grid);

            this.toggleShowImportModal();

            setTimeout(() => {
                this.patchFormValues$.next(session.options);
            }, 100);
        } catch (error) {
            console.error('Input String is invalid');
            throw error;
        }
    }

    /**
     * Responsible for creating the export object and deflating it with pako
     * in order to minimize the visible output string for the end user as much
     * as possible.
     */
    public exportSession(): void {
        let session: Session = undefined;
        let state: any = undefined;
        let stats: Statistic[] = undefined;

        if (this.recordService.getIteration() !== 0) {
            state = this.algorithmService.getSerializedState();
            stats = this.algorithmService.getStatRecords();
        }

        if (this.algorithmService.getAlgorithmMode() === 'maze') {
            session = {
                version: 1,
                algorithm: this.algorithmService.getAlgorithmName() as MazeAlgorithm,
                algorithmMode: this.algorithmService.getAlgorithmMode(),
                iteration: this.recordService.getIteration(),
                state: state,
                stats: stats,
                options: this.algorithmService.getOptions(),
                grid: this.gridList$.getValue(),
                startLoc: this.recordService.getGridStartLocation(),
                goalLoc: this.recordService.getGridGoalLocation()
            };
        } else {
            session = {
                version: 1,
                algorithm: this.algorithmService.getAlgorithmName() as PathFindingAlgorithm,
                algorithmMode: this.algorithmService.getAlgorithmMode(),
                iteration: this.recordService.getIteration(),
                state: state,
                stats: stats,
                heuristic: this.algorithmService.getCurrentHeuristic(),
                pathFindingSettings: {
                    diagonalMovement: this.algorithmService.getDiagonalMovement(),
                    cornerMovement: this.algorithmService.getCrossCorners()
                },
                options: this.algorithmService.getOptions(),
                grid: this.gridList$.getValue(),
                startLoc: this.recordService.getGridStartLocation(),
                goalLoc: this.recordService.getGridGoalLocation()
            };
        }
        // console.log('session', session);
        this.exportToken = pako.deflate(JSON.stringify(session));
    }

    /**
     * Toggles whether it should be possible to press play / next step / complete.
     *
     * @param isDisabled - the new value
     */
    public setDisablePlay(isDisabled: boolean): void {
        this.disablePlay = isDisabled;
    }

    /**
     * Actually sets a step as a new iteration
     *
     * @param newGrid - the current grid
     */
    public setSavePoint(newGrid: Node[][]): void {
        this.gridList$.next(newGrid);
        this.recordService.setGridSavePoint(newGrid);
    }

    /**
     * Sets the new speed up between boundaries
     */
    public setSpeedUp(): void {
        // this.simulationSpeed < 100 ? this.setSimulationSpeed(20) : this.setSimulationSpeed(100);
        this.setSimulationSpeed(this.simulationSpeed < 100 ? 20 : 100);
        this.restartInterval();
    }

    /**
     * Sets the new speed down between boundaries
     */
    public setSpeedDown(): void {
        // this.simulationSpeed > 100 ? this.setSimulationSpeed(-100) : this.setSimulationSpeed(-20);
        this.setSimulationSpeed(this.simulationSpeed > 100 ? -100 : -20);
        this.restartInterval();
    }

    /**
     * This sets the mode for drawing on the grid.
     * You are only able to draw and clear walls nothing else.
     * newMode = -1: only clear nodes of their walls
     * newMode = 0: only draw new nodes on the grid
     * newMode = 1: draw a new start
     * newMode = 2: draw a new goal
     *
     * @param newMode - the new mode to be set for drawing
     */
    public setDrawingMode(newMode: number): void {
        if (this.getDrawingMode() === newMode) {
            this.drawingMode = 0;
        } else {
            this.drawingMode = newMode;
        }
    }

    /**
     * This toggles whether to show weight status
     */
    public toggleWeightStatus(): void {
        this.showWeightStatus = !this.showWeightStatus;
    }

    /**
     * Toggles whether the import modal should be shown
     */
    public toggleShowImportModal(): void {
        this.showImportModal = !this.showImportModal;
    }

    /**
     * Toggles whether the export modal should be shown
     */
    public toggleShowExportModal(): void {
        this.showExportModal = !this.showExportModal;
    }

    /**
     * Toggles whether the legend modal should be shown
     */
    public toggleShowLegendModal(): void {
        this.showLegendModal = !this.showLegendModal;
    }

    /**
     * Returns the current gridList to any subscriber.
     */
    public getGridList(): Observable<Node[][]> {
        return this.gridList$;
    }

    /**
     * Returns the current algorithm name.
     */
    public getAlgorithmName(): MazeAlgorithm | PathFindingAlgorithm {
        return this.algorithmService.getAlgorithmName();
    }

    /**
     * Returns the status whether to disable the controller buttons.
     *
     */
    public getIsPlayDisabled(): boolean {
        return this.disablePlay;
    }

    /**
     * Returns whether  the simulation is currently active.
     */
    public getSimulationStatus(): boolean {
        return this.isSimulationActive;
    }

    /**
     * Returns the current simulation speed.
     */
    public getSimulationSpeed(): number {
        return this.simulationSpeed;
    }

    /**
     * Returns the current drawingMode.
     */
    public getDrawingMode(): number {
        return this.drawingMode;
    }

    /**
     * Returns the backwardStepsAmount.
     */
    public getBackwardStepsAmount(): number {
        return this.backwardStepsAmount;
    }

    /**
     * Returns when the toggle was clicked.
     */
    public getShowWeightStatus(): boolean {
        return this.showWeightStatus;
    }

    /**
     * Returns when a new session has been imported.
     */
    public getPatchFormValues(): Observable<AlgorithmOptions> {
        return this.patchFormValues$;
    }

    /**
     * Returns whether the legend modal should be shown.
     */
    public getShowLegendModal(): boolean {
        return this.showLegendModal;
    }

    /**
     * Returns whether the import modal should be shown.
     */
    public getShowImportModal(): boolean {
        return this.showImportModal;
    }

    /**
     * Returns whether the export modal should be shown.
     */
    public getShowExportModal(): boolean {
        return this.showExportModal;
    }

    /**
     * Returns the current exportToken.
     */
    public getExportToken(): string {
        return this.exportToken;
    }

    public getHandleImport(): Observable<void> {
        return this.handleImport$;
    }
}
