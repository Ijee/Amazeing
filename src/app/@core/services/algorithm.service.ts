import { Injectable } from '@angular/core';
import {
    AlgorithmMode,
    JsonFormData,
    MazeAlgorithm,
    Node,
    PathFindingAlgorithm,
    PathFindingHeuristic,
    StatRecord
} from '../../../types';
import { MazeAlgorithmAbstract } from '../algorithm/maze/maze-algorithm.abstract';
import { Prims } from '../algorithm/maze/creation/prims';
import { GridLocation } from '../../@shared/classes/GridLocation';
import * as _ from 'lodash';
import { AldousBroder } from '../algorithm/maze/creation/aldous-broder';
import { Wilsons } from '../algorithm/maze/creation/wilsons';
import { PathFindingAlgorithmAbstract } from '../algorithm/path-finding/path-finding-algorithm.abstract';
import { AStar } from '../algorithm/path-finding/a-star';
import { Dijkstra } from '../algorithm/path-finding/dijkstra';
import { RecursiveBacktracking } from '../algorithm/maze/creation/recursive-backtracking';

@Injectable({
    providedIn: 'root'
})
export class AlgorithmService {
    private algorithmMode: AlgorithmMode;
    private currentMazeAlgorithm: MazeAlgorithmAbstract;
    private currentPathAlgorithm: PathFindingAlgorithmAbstract;
    private currentHeuristic: PathFindingHeuristic;

    constructor() {
        this.setMazeAlgorithm('Prims');
        this.setPathAlgorithm('Dijkstra');
        this.setCurrentHeuristic('Manhattan');
    }

    /**
     * Switches the current maze algorithm for the
     *
     * @param newAlgo - the new algorithm to be used
     */
    public setMazeAlgorithm(newAlgo: MazeAlgorithm): void {
        switch (newAlgo) {
            case 'Prims':
                this.currentMazeAlgorithm = new Prims();
                break;
            case 'Kruskals':
                break;
            case 'Aldous-Broder':
                this.currentMazeAlgorithm = new AldousBroder();
                break;
            case 'Wilsons':
                this.currentMazeAlgorithm = new Wilsons();
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
            case 'Recursive-Backtracking':
                this.currentMazeAlgorithm = new RecursiveBacktracking();
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

    /**
     * Switches the current path finding algorithm
     *
     * @param newAlgo - the new algorithm to be used
     */
    public setPathAlgorithm(newAlgo: PathFindingAlgorithm): void {
        switch (newAlgo) {
            case 'A-Star':
                this.currentPathAlgorithm = new AStar();
                break;
            case 'IDA-Star':
                break;
            case 'Dijkstra':
                this.currentPathAlgorithm = new Dijkstra();
                break;
            case 'Breadth-FS':
                break;
            case 'Depth-FS':
                break;
            case 'Best-FS':
                break;
            case 'Trace':
                break;
            case 'Jump-PS':
                break;
            case 'Orthogonal-Jump-PS':
                break;
            default:
                throw new Error('Unknown path-finding algorithm selected!');
        }
    }

    /**
     * Sets the new algorithm mode.
     *
     * @param newMode - the new algorithm mode ('maze' | 'path-finding')
     */
    public setAlgorithmMode(newMode: AlgorithmMode): void {
        try {
            this.algorithmMode = newMode;
        } catch {
            throw new Error('Could not set the algorithm mode!');
        }
    }

    public setCurrentHeuristic(newHeuristic: PathFindingHeuristic): void {
        this.currentHeuristic = newHeuristic;
    }

    /**
     * Sets the initial data required for the algorithm to work.
     *
     * @param currentGrid - the currentGrid
     * @param currentStartPoint - the current start point
     */
    public setInitialData(
        currentGrid: Node[][],
        currentStartPoint: GridLocation
    ): void {
        this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.setInitialData(
                  currentGrid,
                  currentStartPoint
              )
            : this.currentPathAlgorithm.setInitialData(
                  currentGrid,
                  currentStartPoint
              );
    }

    /**
     * Sets the options for the currently selected algorithm,-
     *
     * @param options - the new options to be set
     */
    public setOptions(options: Object) {
        this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.setOptions(options)
            : this.currentPathAlgorithm.setOptions(options);
    }

    /**
     * Sets the next step for the grid based on the current algorithm.
     */
    public getNextStep(): Node[][] {
        return this.currentMazeAlgorithm.nextStep();
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
        // this stops the algorithm at a maximum of 10k iterations.
        // TODO use toaster service once available to say that some nodes may be unreachable
        while (!algorithmEnded && iterationCount < 10000) {
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
            this.algorithmMode === 'maze'
                ? this.setMazeAlgorithm(
                      this.currentMazeAlgorithm.getAlgorithmName()
                  )
                : this.setPathAlgorithm(
                      this.currentPathAlgorithm.getAlgorithmName()
                  );
        } else {
            if (deserialize) {
                try {
                    this.algorithmMode === 'maze'
                        ? this.currentMazeAlgorithm.deserialize(
                              newGrid,
                              state,
                              statRecord
                          )
                        : this.currentPathAlgorithm.deserialize(
                              newGrid,
                              state,
                              statRecord
                          );
                } catch (error) {
                    throw new Error('Can not set algorithm State');
                }
            } else {
                this.algorithmMode === 'maze'
                    ? this.currentMazeAlgorithm.updateAlgorithmState(
                          newGrid,
                          state,
                          statRecord
                      )
                    : this.currentPathAlgorithm.updateAlgorithmState(
                          newGrid,
                          state,
                          statRecord
                      );
            }
        }
    }

    /**
     * Returns the current algorithm mode.
     */
    public getAlgorithmMode(): AlgorithmMode {
        return this.algorithmMode;
    }

    /**
     * Returns the algorithm state for the current iteration.
     */
    public getCurrentAlgorithmState(): any {
        return this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.getCurrentAlgorithmState()
            : this.currentPathAlgorithm.getCurrentAlgorithmState();
    }

    /**
     * Returns the currently selected heuristic
     */
    public getCurrentHeuristic(): PathFindingHeuristic {
        return this.currentHeuristic;
    }

    /**
     * Returns the name of the current algorithm.
     */
    public getAlgorithmName(): MazeAlgorithm | PathFindingAlgorithm {
        return this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.getAlgorithmName()
            : this.currentPathAlgorithm.getAlgorithmName();
    }

    /**
     * Returns the stats for the current iteration.
     */
    public getStatRecords(): StatRecord[] {
        return this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.getStatRecords()
            : this.currentPathAlgorithm.getStatRecords();
    }

    /**
     *
     */
    public getJsonFormData(): JsonFormData {
        return this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.getJsonFormData()
            : this.currentPathAlgorithm.getJsonFormData();
    }

    /**
     * Returns the serialized internal state of the current algorithm
     */
    public getSerializedState(): any {
        return this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.getSerializedState()
            : this.currentPathAlgorithm.getSerializedState();
    }

    /**
     * Returns whether or not the current algorithm uses node weights.
     */
    public usesNodeWeights(): boolean {
        return this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.usesNodeWeights()
            : this.currentPathAlgorithm.usesNodeWeights();
    }
}
