import { Injectable } from '@angular/core';
import { MazeAlgorithmAbstract } from '../algorithm/maze/maze-algorithm.abstract';
import { Prims } from '../algorithm/maze/creation/prims';
import { GridLocation } from '../../@shared/classes/GridLocation';
import { isEmpty } from 'lodash-es';
import { AldousBroder } from '../algorithm/maze/creation/aldous-broder';
import { Wilsons } from '../algorithm/maze/creation/wilsons';
import { PathFindingAlgorithmAbstract } from '../algorithm/path-finding/path-finding-algorithm.abstract';
import { AStar } from '../algorithm/path-finding/a-star';
import { Dijkstra } from '../algorithm/path-finding/dijkstra';
import { RecursiveBacktracking } from '../algorithm/maze/creation/recursive-backtracking';
import { HuntAndKill } from '../algorithm/maze/creation/hunt-and-kill';
import {
    AlgorithmMode,
    MazeAlgorithm,
    Node,
    PathFindingAlgorithm,
    PathFindingHeuristic,
    Statistic
} from '../types/algorithm.types';
import { AlgorithmOptions, JsonFormData } from '../types/jsonform.types';
import { Sidewinder } from '../algorithm/maze/creation/sidewinder';
import { BinaryTree } from '../algorithm/maze/creation/binary-tree';
import { GrowingTree } from '../algorithm/maze/creation/growing-tree';
import { RecursiveDivision } from '../algorithm/maze/creation/recursive-division';
import { Kruskals } from '../algorithm/maze/creation/kruskals';
import { Ellers } from '../algorithm/maze/creation/ellers';
import { WallFollower } from '../algorithm/path-finding/maze-specific/wall-follower';
import { Meta } from '@angular/platform-browser';
import { Pledge } from '../algorithm/path-finding/maze-specific/pledge';
import { Tremaux } from '../algorithm/path-finding/maze-specific/tremaux';
import { DeadEndFilling } from '../algorithm/path-finding/maze-specific/dead-end-filling';
import { MazeRouting } from '../algorithm/path-finding/maze-specific/maze-routing';
import { BreadthFirstSearch } from '../algorithm/path-finding/breadth-first-search';
import { DepthFirstSearch } from '../algorithm/path-finding/depth-first-search';

@Injectable({
    providedIn: 'root'
})
export class AlgorithmService {
    private algorithmMode: AlgorithmMode;
    private currentMazeAlgorithm: MazeAlgorithmAbstract;
    private currentPathAlgorithm: PathFindingAlgorithmAbstract;
    private currentHeuristic: PathFindingHeuristic;

    constructor(private meta: Meta) {
        this.setAlgorithmMode('maze');
        this.setMazeAlgorithm('Prims');
        this.setPathAlgorithm('Dijkstra');
        this.setCurrentHeuristic('Manhattan');
    }

    /**
     * Sets the new algorithm mode.
     *
     * @param newMode - the new algorithm mode ('maze' | 'path-finding')
     */
    public setAlgorithmMode(newMode: AlgorithmMode): void {
        try {
            this.algorithmMode = newMode;
            // Is used by some buttons to change the colour´.
            const newColor = newMode === 'maze' ? '--bulma-primary' : '--bulma-danger';
            document.documentElement.style.setProperty(
                '--algorithm-mode-color',
                'var(' + newColor + ')'
            );

            let colour = getComputedStyle(document.documentElement).getPropertyValue(
                '--algorithm-mode-color'
            );
            // This changes the notch / title bar colour
            // TODO Maybe animate it? (use 500ms ease-in-out / global animation css-var)
            this.meta.updateTag({ name: 'theme-color', content: colour });
        } catch {
            /**/
            throw new Error('Could not set the algorithm mode!');
        }
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
                this.currentMazeAlgorithm = new Kruskals();
                break;
            case 'Aldous-Broder':
                this.currentMazeAlgorithm = new AldousBroder();
                break;
            case 'Wilsons':
                this.currentMazeAlgorithm = new Wilsons();
                break;
            case 'Ellers':
                this.currentMazeAlgorithm = new Ellers();
                break;
            case 'Sidewinder':
                this.currentMazeAlgorithm = new Sidewinder();
                break;
            case 'Hunt-and-Kill':
                this.currentMazeAlgorithm = new HuntAndKill();
                break;
            case 'Growing-Tree':
                this.currentMazeAlgorithm = new GrowingTree();
                break;
            case 'Binary-Tree':
                this.currentMazeAlgorithm = new BinaryTree();
                break;
            case 'Recursive-Backtracking':
                this.currentMazeAlgorithm = new RecursiveBacktracking();
                break;
            case 'Recursive-Division':
                this.currentMazeAlgorithm = new RecursiveDivision();
                break;
            case 'Cellular-Automation':
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
                this.currentPathAlgorithm = new BreadthFirstSearch();
                break;
            case 'Depth-FS':
                this.currentPathAlgorithm = new DepthFirstSearch();
                break;
            case 'Best-FS':
                break;
            case 'Trace':
                break;
            case 'Jump-PS':
                break;
            case 'Orthogonal-Jump-PS':
                break;
            case 'Wall-Follower':
                this.currentPathAlgorithm = new WallFollower();
                break;
            case 'Pledge':
                this.currentPathAlgorithm = new Pledge();
                break;
            case 'Trémaux':
                this.currentPathAlgorithm = new Tremaux();
                break;
            case 'Recursive':
                break;
            case 'Dead-End-Filling':
                this.currentPathAlgorithm = new DeadEndFilling();
                break;
            case 'Maze-Routing':
                this.currentPathAlgorithm = new MazeRouting();
                break;
            default:
                throw new Error('Unknown path-finding algorithm selected!');
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
    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        if (this.algorithmMode === 'maze') {
            this.currentMazeAlgorithm.setInitialData(currentGrid, currentStartPoint);
        } else {
            this.currentPathAlgorithm.setInitialData(currentGrid, currentStartPoint);
            this.currentPathAlgorithm.setHeuristic(this.currentHeuristic);
        }
    }

    /**
     * Sets the options for the currently selected algorithm,-
     *
     * @param options - the new options to be set
     */
    public setOptions(options: AlgorithmOptions) {
        this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.setOptions(options)
            : this.currentPathAlgorithm.setOptions(options);
    }

    /**
     * Sets the next step for the grid based on the current algorithm.
     */
    public getNextStep(): Node[][] {
        return this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.nextStep()
            : this.currentPathAlgorithm.nextStep();
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
     * @param deserialize - whether to deserialize the state object before updating the algorithm state
     */
    public updateAlgorithmState(
        newGrid: Node[][],
        state: any,
        statRecord: Statistic[],
        deserialize?: boolean
    ): void {
        if (isEmpty(state)) {
            this.algorithmMode === 'maze'
                ? this.setMazeAlgorithm(this.currentMazeAlgorithm.getAlgorithmName())
                : this.setPathAlgorithm(this.currentPathAlgorithm.getAlgorithmName());
        } else {
            if (deserialize) {
                try {
                    this.algorithmMode === 'maze'
                        ? this.currentMazeAlgorithm.deserialize(newGrid, state, statRecord)
                        : this.currentPathAlgorithm.deserialize(newGrid, state, statRecord);
                } catch (error) {
                    console.error('Can not set algorithm State');
                    throw error;
                }
            } else {
                this.algorithmMode === 'maze'
                    ? this.currentMazeAlgorithm.updateState(newGrid, state, statRecord)
                    : this.currentPathAlgorithm.updateState(newGrid, state, statRecord);
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
            ? this.currentMazeAlgorithm.getState()
            : this.currentPathAlgorithm.getState();
    }

    /**
     * Returns the currently selected heuristic or 'None' when a
     * Maze-Solving Algorithm has been selected.
     */
    public getCurrentHeuristic(): PathFindingHeuristic {
        if (this.currentPathAlgorithm.usesHeuristics()) {
            return this.currentHeuristic;
        } else {
            return 'None';
        }
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
    public getStatRecords(): Statistic[] {
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

    public getOptions(): AlgorithmOptions {
        return this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.getOptions()
            : this.currentPathAlgorithm.getOptions();
    }

    /**
     * Returns the serialized internal state of the current algorithm
     */
    public getSerializedState(): any {
        return this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.serialize()
            : this.currentPathAlgorithm.serialize();
    }

    /**
     * Returns whether the current algorithm uses node weights.
     */
    public usesNodeWeights(): boolean {
        return this.algorithmMode === 'maze'
            ? this.currentMazeAlgorithm.usesNodeWeights()
            : this.currentPathAlgorithm.usesNodeWeights();
    }
}
