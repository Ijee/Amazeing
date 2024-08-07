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
import { BestFIrstSearch } from '../algorithm/path-finding/best-first-search';
import { CellularAutomaton } from '../algorithm/maze/creation/cellular-automaton';

@Injectable({
    providedIn: 'root'
})
export class AlgorithmService {
    private algorithmMode: AlgorithmMode;
    private mazeAlgorithm: MazeAlgorithmAbstract;
    private pathAlgorithm: PathFindingAlgorithmAbstract;
    private heuristic: PathFindingHeuristic = 'Manhattan';
    private diagonalMovement = false;
    private crossCorners = false;

    constructor(private meta: Meta) {
        this.setAlgorithmMode('maze');
        this.setMazeAlgorithm('Prims');
        this.setPathAlgorithm('A-Star');
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
                this.mazeAlgorithm = new Prims();
                break;
            case 'Kruskals':
                this.mazeAlgorithm = new Kruskals();
                break;
            case 'Aldous-Broder':
                this.mazeAlgorithm = new AldousBroder();
                break;
            case 'Wilsons':
                this.mazeAlgorithm = new Wilsons();
                break;
            case 'Ellers':
                this.mazeAlgorithm = new Ellers();
                break;
            case 'Sidewinder':
                this.mazeAlgorithm = new Sidewinder();
                break;
            case 'Hunt-and-Kill':
                this.mazeAlgorithm = new HuntAndKill();
                break;
            case 'Growing-Tree':
                this.mazeAlgorithm = new GrowingTree();
                break;
            case 'Binary-Tree':
                this.mazeAlgorithm = new BinaryTree();
                break;
            case 'Recursive-Backtracking':
                this.mazeAlgorithm = new RecursiveBacktracking();
                break;
            case 'Recursive-Division':
                this.mazeAlgorithm = new RecursiveDivision();
                break;
            case 'Cellular-Automaton':
                this.mazeAlgorithm = new CellularAutomaton();
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
                this.pathAlgorithm = new AStar();
                break;
            case 'IDA-Star':
                break;
            case 'Dijkstra':
                this.pathAlgorithm = new Dijkstra();
                break;
            case 'Breadth-FS':
                this.pathAlgorithm = new BreadthFirstSearch();
                break;
            case 'Depth-FS':
                this.pathAlgorithm = new DepthFirstSearch();
                break;
            case 'Best-FS':
                this.pathAlgorithm = new BestFIrstSearch();
                break;
            case 'Jump-PS':
                break;
            case 'Orthogonal-Jump-PS':
                break;
            case 'Wall-Follower':
                this.pathAlgorithm = new WallFollower();
                break;
            case 'Pledge':
                this.pathAlgorithm = new Pledge();
                break;
            case 'Trémaux':
                this.pathAlgorithm = new Tremaux();
                break;
            case 'Dead-End-Filling':
                this.pathAlgorithm = new DeadEndFilling();
                break;
            case 'Maze-Routing':
                this.pathAlgorithm = new MazeRouting();
                break;
            default:
                throw new Error('Unknown path-finding algorithm selected!');
        }

        if (!this.pathAlgorithm.usesPathFindingSettings()) {
            this.diagonalMovement = false;
            this.crossCorners = false;
        }

        if (this.pathAlgorithm.usesHeuristics() && this.heuristic === 'None') {
            this.heuristic = 'Manhattan';
        }
    }

    /**
     * Sets the initial data required for the algorithm to work.
     *
     * @param currentGrid - the currentGrid
     * @param startLocation - the goal location
     * @param goalLocation - the goal location
     */
    public setInitialData(
        currentGrid: Node[][],
        startLocation: GridLocation,
        goalLocation: GridLocation
    ): void {
        if (this.algorithmMode === 'maze') {
            this.mazeAlgorithm.setInitialData(currentGrid, startLocation);
        } else {
            this.pathAlgorithm.setDiagonalMovement(this.diagonalMovement);
            this.pathAlgorithm.setCrossCorners(this.crossCorners);
            this.pathAlgorithm.setInitialData(currentGrid, startLocation);
            this.pathAlgorithm.setHeuristic(this.heuristic);

            this.pathAlgorithm.setGoal(goalLocation);
        }
    }

    /**
     *  Sets the new goal location for the pathfinding algorithm.
     *
     * @param loc the new goal location
     */
    public setGoalLocation(loc: GridLocation): void {
        this.pathAlgorithm.setGoal(loc);
    }

    /**
     * Sets the options for the currently selected algorithm,-
     *
     * @param options - the new options to be set
     */
    public setOptions(options: AlgorithmOptions) {
        this.algorithmMode === 'maze'
            ? this.mazeAlgorithm.setOptions(options)
            : this.pathAlgorithm.setOptions(options);
    }

    public setHeuristic(newHeuristic: PathFindingHeuristic): void {
        this.heuristic = newHeuristic;
    }

    /**
     * Sets the diagonal movement setting.
     *
     * @param val the setting to be
     */
    public setDiagonalMovement(val: boolean) {
        if (!val) {
            this.crossCorners = false;
        }
        this.diagonalMovement = val;
    }

    /**
     * Sets the cross corners setting.
     *
     * @param val the setting to be
     */
    public setCrossCorners(val: boolean) {
        if (val) {
            this.diagonalMovement = true;
        }
        this.crossCorners = val;
    }

    /**
     * Sets the next step for the grid based on the current algorithm.
     */
    public getNextStep(): Node[][] {
        return this.algorithmMode === 'maze'
            ? this.mazeAlgorithm.nextStep()
            : this.pathAlgorithm.nextStep();
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
                ? this.setMazeAlgorithm(this.mazeAlgorithm.getAlgorithmName())
                : this.setPathAlgorithm(this.pathAlgorithm.getAlgorithmName());
        } else {
            if (deserialize) {
                try {
                    this.algorithmMode === 'maze'
                        ? this.mazeAlgorithm.deserialize(newGrid, state, statRecord)
                        : this.pathAlgorithm.deserialize(newGrid, state, statRecord);
                } catch (error) {
                    console.error('Can not set algorithm State');
                    throw error;
                }
            } else {
                this.algorithmMode === 'maze'
                    ? this.mazeAlgorithm.updateState(newGrid, state, statRecord)
                    : this.pathAlgorithm.updateState(newGrid, state, statRecord);
            }
        }
    }

    /**
     * Updates the algorithm speciifc settings on the currently selected pathfinding algorithm.
     *
     * Only gets called when importing a pathfinding algorithm.
     */
    public updatePathfindingSettings(): void {
        this.pathAlgorithm.setHeuristic(this.heuristic);
        this.pathAlgorithm.setDiagonalMovement(this.crossCorners);
        this.pathAlgorithm.setCrossCorners(this.crossCorners);
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
            ? this.mazeAlgorithm.getState()
            : this.pathAlgorithm.getState();
    }

    /**
     * Returns the currently selected heuristic or 'None
     */
    public getCurrentHeuristic(): PathFindingHeuristic {
        return this.heuristic;
    }

    /**
     * Returns the name of the current algorithm or the current one
     * from the requested algorithm mode.
     *
     * @param algoMode the algorithm mode to be used
     */
    public getAlgorithmName(algoMode?: AlgorithmMode): MazeAlgorithm | PathFindingAlgorithm {
        const mode = algoMode || this.algorithmMode;

        return mode === 'maze'
            ? this.mazeAlgorithm.getAlgorithmName()
            : this.pathAlgorithm.getAlgorithmName();
    }

    /**
     * Returns the stats for the current iteration.
     */
    public getStatRecords(): Statistic[] {
        return this.algorithmMode === 'maze'
            ? this.mazeAlgorithm.getStatRecords()
            : this.pathAlgorithm.getStatRecords();
    }

    /**
     * Returns the jsonFormData.
     */
    public getJsonFormData(algoMode: AlgorithmMode): JsonFormData {
        return algoMode === 'maze'
            ? this.mazeAlgorithm.getJsonFormData()
            : this.pathAlgorithm.getJsonFormData();
    }

    /**
     * Returns the algorithm options.
     *
     * @returns the algorithm options
     */
    public getOptions(): AlgorithmOptions {
        return this.algorithmMode === 'maze'
            ? this.mazeAlgorithm.getOptions()
            : this.pathAlgorithm.getOptions();
    }

    /**
     * Returns the diagonal movement user setting (pathfinding mode only).
     *
     * @returns the user setting
     */
    public getDiagonalMovement(): boolean {
        return this.diagonalMovement;
    }

    /**
     * Returns the cross corners user setting (pathfinding mode only).
     *
     * @returns the user setting
     */
    public getCrossCorners(): boolean {
        return this.crossCorners;
    }

    /**
     * Returns the serialized internal state of the current algorithm
     */
    public getSerializedState(): any {
        return this.algorithmMode === 'maze'
            ? this.mazeAlgorithm.serialize()
            : this.pathAlgorithm.serialize();
    }

    /**
     * Returns whether the current algorithm uses node weights.
     */
    public usesNodeWeights(): boolean {
        return this.algorithmMode === 'maze'
            ? this.mazeAlgorithm.usesNodeWeights()
            : this.pathAlgorithm.usesNodeWeights();
    }

    /**
     * Returns whether the current algorithm uses heuristics..
     */
    public usesHeuristics(): boolean {
        return this.pathAlgorithm.usesHeuristics();
    }

    /**
     * Returns whether the current algorithm allowes the use of the pathfinding settings
     */
    public usesPathFindingSettings(): boolean {
        return this.pathAlgorithm.usesPathFindingSettings();
    }
    /**
     * Returns whether the current algorithm forces the diagonal movement functionality.
     */
    public forcesDiagonalMovement(): boolean {
        return this.pathAlgorithm.forcesDiagonalMovement();
    }
}
