import { Injectable } from '@angular/core';
import { Node, StatRecord } from '../../../types';
import { GridLocation } from '../../@shared/classes/GridLocation';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class RecordService {
    public static readonly MAX_SAVE_STEPS = 21;

    private gridHistory: Node[][][];
    private gridSavePoint: Node[][];
    private gridSavePointRecords: StatRecord[];
    private statRecordHistory: StatRecord[][];
    private gridStartLocation: GridLocation;
    private gridGoalLocation: GridLocation;
    private iteration: number;
    // has to be any as there are a lot of algorithm and there
    // is no benefit to type it as it can only break at two points
    private algorithmStateHistory: Array<any>;

    constructor() {
        this.gridHistory = [];
        this.gridSavePoint = [];
        this.gridSavePointRecords = [];
        this.statRecordHistory = [];
        this.gridStartLocation = null;
        this.gridGoalLocation = null;
        // Stats
        this.iteration = 0;
        this.algorithmStateHistory = [{}];
    }

    /**
     * Is responsible to save the current state of the stats and
     * grids on a iteration by iteration basis so that it can be retrieved
     *
     * The simulation needs n + 1 to work.
     *
     * @param gridList - the gridList used in the grid component
     */
    public manageGridHistory(gridList: Node[][]): void {
        if (this.gridHistory.length >= RecordService.MAX_SAVE_STEPS) {
            this.gridHistory.shift();
        }
        this.gridHistory.push(gridList);
    }

    /**
     * This manipulates the history of all tracked states as well as the gridList
     * when the backwardsStep is called on the controller
     */
    public manipulateHistory(): void {
        this.iteration--;
        this.gridHistory.pop();
        this.statRecordHistory.pop();
        this.algorithmStateHistory.pop();
    }

    public setGridHistory(newGridHistory: Array<Node[][]>): void {
        this.gridHistory = newGridHistory;
    }

    public setGridSavePoint(newSavePoint: Node[][]): void {
        this.gridSavePoint = newSavePoint;
    }

    public setGridSavePointRecords(newSavePointStats: StatRecord[]): void {
        this.gridSavePointRecords = newSavePointStats;
    }

    public setGridStartLocation(loc: GridLocation): void {
        this.gridStartLocation = loc;
    }

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
     * Adds a new entry to the stat history.
     *
     * @param newRecord - the new stat record
     */
    public addStatRecord(newRecord: StatRecord[]): void {
        if (this.statRecordHistory.length >= RecordService.MAX_SAVE_STEPS) {
            this.statRecordHistory.shift();
        }
        this.statRecordHistory.push(_.cloneDeep(newRecord));
    }

    /**
     * Adds a new entry to the algorithm state history.
     *
     * @param newState - the new stat record
     */
    public addAlgorithmState(newState: any): void {
        if (this.algorithmStateHistory.length >= RecordService.MAX_SAVE_STEPS) {
            this.algorithmStateHistory.shift();
        }
        this.algorithmStateHistory.push(_.cloneDeep(newState));
    }

    /**
     * Fully resets the algorithm stats.
     */
    public resetStatRecordHistory(): void {
        this.statRecordHistory = [];
    }

    /**
     * Fully resets the algorithm state history.
     */
    public resetAlgorithmStateHistory(): void {
        this.algorithmStateHistory = [];
    }

    /**
     * Returns the current Grid.
     */
    public getCurrentGrid(): Node[][] {
        return this.gridHistory[this.gridHistory.length - 1];
    }

    public getGridSavePoint(): Node[][] {
        return this.gridSavePoint;
    }

    /**
     * Returns the grid save point.
     */
    public getGridSavePointRecords(): StatRecord[] {
        return this.gridSavePointRecords;
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

    /**
     * Returns the current statRecordHistory.
     */
    public getCurrentStatRecords(): StatRecord[] {
        return this.statRecordHistory[this.statRecordHistory.length - 1];
    }

    /**
     * Returns the current algorithmState.
     */
    public getCurrentAlgorithmState(): any {
        return this.algorithmStateHistory[
            this.algorithmStateHistory.length - 1
        ];
    }
}
