import { Injectable } from '@angular/core';
import { GridLocation } from '../../@shared/classes/GridLocation';
import { AlgorithmRecord, Node, Statistic } from '../types/algorithm.types';

@Injectable({
    providedIn: 'root'
})
export class RecordService {
    public static readonly MAX_SAVE_STEPS = 21;

    private history: AlgorithmRecord[];
    private currentHistoryIndex: number;

    private gridSavePoint: Node[][];
    private gridStartLocation: GridLocation;
    private gridGoalLocation: GridLocation;
    private iteration: number;

    constructor() {
        this.history = [];
        this.currentHistoryIndex = 0;

        this.gridSavePoint = [];
        this.gridStartLocation = null;
        this.gridGoalLocation = null;
        // Stats
        this.iteration = 0;
    }

    /**
     * Saves an actual algorithm iteration as a record with all necessary information
     *
     * This is used for backwards and forward steps to have it be deterministic instead
     * of getting a new iteration from the algorithm itself which can differ from the
     * previous result.
     *
     * @param grid the grid to be saved
     * @param state the state to be saved
     * @param statRecord the statRecord to be saved
     */
    public addHistoryStep(grid: Node[][], state: any, statRecord: Statistic[]) {
        if (this.history.length >= RecordService.MAX_SAVE_STEPS) {
            this.history.shift();
        } else {
            this.currentHistoryIndex++;
        }
        this.history.push({
            grid: grid,
            state: state,
            statRecord: statRecord
        });
    }

    /**
     * Saves a snapshot of the grid and is used when drawing on the grid.
     * Obviously there is no state or statRecord that can then be saved.
     *
     * @param grid the grid to be saved
     */
    public addEmptyHistoryStep(grid: Node[][]) {
        if (this.history.length >= RecordService.MAX_SAVE_STEPS) {
            this.history.shift();
        }
        this.currentHistoryIndex = this.history.length;
        this.history.push({
            grid: grid,
            state: null,
            statRecord: null
        });
    }

    /**
     * Determines if the next iteration has been shown before.
     *
     */
    public tryHistoryStepForward(): boolean {
        if (this.currentHistoryIndex < this.history.length - 1) {
            this.currentHistoryIndex++;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Moves the history index backwards.
     *
     * There is no logic here and is instead done in the function calling this.
     */
    public historyStepBackwards() {
        this.currentHistoryIndex--;
    }

    /**
     * Resets the current history.
     */
    public resetHistory() {
        this.history = [];
        this.currentHistoryIndex = 0;
    }

    /**
     * Saves a new grid savepoint.
     *
     * This is being used when drawing on the grid.
     * @param newSavePoint
     */
    public setGridSavePoint(newSavePoint: Node[][]): void {
        this.gridSavePoint = newSavePoint;
    }

    /**
     * Sets the grid start location.
     * @param loc the new location
     */
    public setGridStartLocation(loc: GridLocation): void {
        this.gridStartLocation = loc;
    }

    /**
     * Sets the grid goal location.
     * @param loc the new location
     */
    public setGridGoalLocation(loc: GridLocation): void {
        this.gridGoalLocation = loc;
    }

    /**
     * Sets the  new value to the current tick on every tick.
     *
     * @param value - the new value to be set
     */
    public setIteration(value: number): void {
        this.iteration = value;
    }

    /**
     * Returns the current history step.
     */
    getCurrentHistoryStep() {
        return this.history[this.currentHistoryIndex];
    }

    public getGridSavePoint(): Node[][] {
        return this.gridSavePoint;
    }

    /**
     * Returns the grid start location.
     */
    public getGridStartLocation(): GridLocation {
        return this.gridStartLocation;
    }

    /**
     * Returns the grid goal location.
     */
    public getGridGoalLocation(): GridLocation {
        return this.gridGoalLocation;
    }

    /**
     * Returns the current iteration.
     */
    public getIteration(): number {
        return this.iteration;
    }
}
