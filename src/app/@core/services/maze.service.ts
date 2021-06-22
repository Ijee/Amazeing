import { Injectable } from '@angular/core';
import { MazeAlgorithm, Node, StatRecord } from '../../../types';
import { MazeAlgorithmAbstract } from '../algorithm/maze/maze-algorithm.abstract';
import { Prims } from '../algorithm/maze/creation/prims';
import { GridLocation } from '../../@shared/classes/GridLocation';
import * as _ from 'lodash';
import { AldousBroder } from '../algorithm/maze/creation/aldous-broder';

@Injectable({
    providedIn: 'root'
})
export class MazeService {
    private currentAlgorithm: MazeAlgorithmAbstract;
    constructor() {
        this.switchAlgorithm('Prims');
    }

    /**
     * Switches the current maze algorithm for the
     *
     * @param newAlgo - the new algorithm to be used
     */
    public switchAlgorithm(newAlgo: MazeAlgorithm): void {
        switch (newAlgo) {
            case 'Prims':
                this.currentAlgorithm = new Prims();
                break;
            case 'Kruskals':
                break;
            case 'Aldous-Broder':
                this.currentAlgorithm = new AldousBroder();
                break;
            case 'Wilsons':
                break;
            case 'Ellers':
                break;
            case 'Sidewinder':
                break;
            case 'Hunt-and-Kill':
                break;
            case 'Growing-Tree':
                break;
            case 'Binary-Tree':
                break;
            case 'Recursive-Backtracker':
                break;
            case 'Recursive-Division':
                break;
            case 'Cellular-Automation':
                break;
            case 'Pledge':
                break;
            case 'Trémaux':
                break;
            case 'Recursive':
                break;
            case 'Dead-End-Filling':
                break;
            case 'Maze-Routing':
                break;
            default:
                throw new Error('Unknown maze algorithm selected!');
        }
    }

    public setInitialData(
        currentGrid: Node[][],
        currentStartPoint: GridLocation
    ): void {
        this.currentAlgorithm.setInitialData(currentGrid, currentStartPoint);
    }

    /**
     * Sets the next step for the grid based on the current algorithm.
     */
    public getNextStep(): Node[][] {
        return this.currentAlgorithm.nextStep();
    }

    /**
     * Returns the last step of an algorithm.
     * Or rather - it completed the algorithm entirely.
     *
     * @param currentGrid - the currentGrid
     */
    public completeAlgorithm(currentGrid: Node[][]): [number, Node[][]] {
        let algorithmEnded = false;
        let lastGrid: Node[][];
        let iterationCount = 0;
        while (!algorithmEnded) {
            const tempGrid = this.getNextStep();
            if (tempGrid === null) {
                algorithmEnded = true;
            } else {
                lastGrid = tempGrid;
                iterationCount++;
            }
        }
        return [iterationCount, lastGrid];
    }

    /**
     * Updates the internal algorithm state and stats.
     *
     * @param newGrid - the current Grid
     * @param state - the new algorithm state
     * @param statRecord - the new statRecord
     * @param deserialize - whether or not to deserialize the state object before updating the algorithm state
     */
    public updateAlgorithmState(
        newGrid: Node[][],
        state: any,
        statRecord: StatRecord[],
        deserialize?: boolean
    ): void {
        if (_.isEmpty(state)) {
            this.switchAlgorithm(this.getAlgorithmName());
        } else {
            if (deserialize) {
                try {
                    this.currentAlgorithm.deserialize(
                        newGrid,
                        state,
                        statRecord
                    );
                } catch (error) {
                    throw new Error('Can not set algorithm State');
                }
            } else {
                this.currentAlgorithm.updateAlgorithmState(
                    newGrid,
                    state,
                    statRecord
                );
            }
        }
    }

    /**
     * Returns the serialized internal state of the current algorithm
     */
    public getSerializedState(): any {
        return this.currentAlgorithm.getSerializedState();
    }

    /**
     * Returns the name of the current algorithm.
     */
    public getAlgorithmName(): MazeAlgorithm {
        return this.currentAlgorithm.getAlgorithmName();
    }

    /**
     * Returns the stats for the current iteration.
     */
    public getStatRecords(): StatRecord[] {
        return this.currentAlgorithm.getStatRecords();
    }

    /**
     * Returns the algorithm state for the current iteration.
     */
    public getCurrentAlgorithmState(): any {
        return this.currentAlgorithm.getCurrentAlgorithmState();
    }

    /**
     * Returns whether or not the current algorithm uses node weights.
     */
    public usesNodeWeights(): boolean {
        return this.currentAlgorithm.usesNodeWeights();
    }
}
