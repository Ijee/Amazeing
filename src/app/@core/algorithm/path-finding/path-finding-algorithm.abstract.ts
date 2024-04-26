import { GridLocation } from '../../../@shared/classes/GridLocation';
import {
    Node,
    PathFindingAlgorithm,
    PathFindingHeuristic,
    Statistic
} from '../../types/algorithm.types';
import { AlgorithmOptions, JsonFormData } from '../../types/jsonform.types';
import { chebyshevDistance } from './heuristic/chebyshev';
import { euclideanDistance } from './heuristic/euclidean';
import { manhattanDistance } from './heuristic/manhattan';
import { octileDistance } from './heuristic/octile';

export abstract class PathFindingAlgorithmAbstract {
    protected constructor(
        protected currentGrid: Node[][],
        protected statRecords: Statistic[],
        protected jsonFormData: JsonFormData,
        protected options: AlgorithmOptions,
        protected heuristic: PathFindingHeuristic
    ) {}

    /**
     * Calculates the heuristic distance of two given GridLocations
     * based on which heuristic the user selected.
     *
     * @param loc1 the first location
     * @param loc2 the second location
     * @param heuristic the selected heuristic
     * @returns the caluldated distance
     */
    protected calculateDistance(
        loc1: GridLocation,
        loc2: GridLocation,
        heuristic: PathFindingHeuristic
    ): number {
        switch (heuristic) {
            case 'Manhattan':
                return manhattanDistance(loc1, loc2);
            case 'Euclidean':
                return euclideanDistance(loc1, loc2);
            case 'Octile':
                return octileDistance(loc1, loc2);
            case 'Chebyshev':
                return chebyshevDistance(loc1, loc2);
            default:
        }
    }

    /**
     * Paints a node on the grid.
     *
     * This is purely to avoid exactly this kind of code, and it is
     * a lot of noise just not to remove the start and goal node.
     *
     * @param x the x coordinate
     * @param y the y coordinate
     * @param status the status to paint it to
     * @protected
     */
    protected paintNode(x: number, y: number, status: number);
    protected paintNode(loc: GridLocation, status: number);
    protected paintNode(xOrLoc: number | GridLocation, yOrStatus: number, status?: number): void {
        if (typeof xOrLoc === 'number') {
            if (
                this.currentGrid[xOrLoc][yOrStatus].status !== 2 &&
                this.currentGrid[xOrLoc][yOrStatus].status !== 3
            ) {
                this.currentGrid[xOrLoc][yOrStatus].status = status;
            }
        } else {
            this.paintNode(xOrLoc.x, xOrLoc.y, yOrStatus);
        }
    }

    /**
     * Returns the neighbours for a given GridLocation.
     *
     * @param loc the GridLocation to get the neighbours from
     * @param distance the distance from the location where the neighbours should be located
     * @protected
     */
    protected getNeighbours(loc: GridLocation, distance: number): GridLocation[] {
        const res: GridLocation[] = [];
        if (loc.y < this.currentGrid[0].length - distance) {
            const node = this.currentGrid[loc.x][loc.y + distance];
            res.push(new GridLocation(loc.x, loc.y + distance, node.weight, node.status));
        }
        if (loc.x < this.currentGrid.length - distance) {
            const node = this.currentGrid[loc.x + distance][loc.y];
            res.push(new GridLocation(loc.x + distance, loc.y, node.weight, node.status));
        }
        if (loc.y >= distance) {
            const node = this.currentGrid[loc.x][loc.y - distance];
            res.push(new GridLocation(loc.x, loc.y - distance, node.weight, node.status));
        }
        if (loc.x >= distance) {
            const node = this.currentGrid[loc.x - distance][loc.y];
            res.push(new GridLocation(loc.x - distance, loc.y, node.weight, node.status));
        }
        return res;
    }

    /**
     * Returns the new step / iteration based on the currentGrid.
     * Returns null when no further iteration can be done.
     */
    public abstract nextStep(): Node[][] | null;

    /**
     * Sets the starting point for the algorithm to the one
     * the user set on the grid
     *
     * @param currentGrid the current grid from the simulation service
     * @param currentStartPoint the starting point for the algorithm
     * @param pathfindingHeuristic the selected pathfinding heuristic
     */
    public abstract setInitialData(
        currentGrid: Node[][],
        currentStartPoint: GridLocation,
        pathfindingHeuristic: PathFindingHeuristic
    ): void;

    /**
     * Sets the options for the algorithm.
     * The available values are based on what has been declared in jsonFormData.
     *
     * @param options
     */
    public setOptions(options: AlgorithmOptions) {
        this.options = options;
    }

    /**
     * Updates the algorithm state that needs to be done when
     * either a backwards step has been set or the client
     * tried to import from a string through the ui.
     *
     * Refer to how to load the state back in on what is being returned
     * in getCurrentAlgorithmState
     *
     * @param deserializedState the new algorithm state
     * @param statRecords the new algorithm statRecords
     * @param newGrid the current Grid
     */

    public abstract updateState(
        newGrid: Node[][],
        deserializedState: any,
        statRecords: Statistic[]
    ): void;

    /**
     * This function is responsible for deserializing the internal state of the algorithm and
     * then updating it by calling updateAlgorithmState with it.
     *
     * It is being called when the user tries to import a custom session into the app.
     *
     * @param newGrid the current Grid
     * @param serializedState the serialized data
     * @param statRecords the new algorithm stats
     */
    public abstract deserialize(
        newGrid: Node[][],
        serializedState: any,
        statRecords: Statistic[]
    ): void;

    /**
     * This function serializes the internal state of the algorithm and then returns it as an object.
     * This has to be done in order to make the state exportable as a JSON string.
     *
     * Remember that classes can not be serialized with JSON.stringify as they most often include functions.
     */
    public abstract serialize(): Object;

    /**
     * Returns the current algorithm state.
     */
    public abstract getState(): Object;

    /**
     * Returns the name of the algorithm.
     */
    public abstract getAlgorithmName(): PathFindingAlgorithm;

    /**
     * Returns the stat records for the algorithm,.
     */
    public getStatRecords(): Statistic[] {
        return this.statRecords;
    }

    /**
     * Returns the algorithm options in a json format.
     * This is being used to create a form for the current algorithm so the user
     * can choose alternative algorithm implementations.
     */
    public getJsonFormData(): JsonFormData {
        return this.jsonFormData;
    }

    /**
     * Returns the selected algorithm options.
     */
    public getOptions(): AlgorithmOptions {
        return this.options;
    }

    /**
     * Returns whether the current algorithm uses node weights.
     */
    public abstract usesNodeWeights(): boolean;

    /**
     * Returns whether the current algorithm allowes the user to use the heuristics options.
     */
    public abstract usesHeuristics(): boolean;
}
