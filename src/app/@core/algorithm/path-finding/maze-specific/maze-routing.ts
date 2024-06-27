import { Node, Statistic, PathFindingAlgorithm } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { PathFindingAlgorithmAbstract } from '../path-finding-algorithm.abstract';

export class MazeRouting extends PathFindingAlgorithmAbstract {
    private queue: GridLocation[];
    private backtracking: GridLocation;
    constructor() {
        super(
            [],
            [
                {
                    name: 'Fastest path',
                    type: 'status-8'
                }
            ],
            {
                controls: []
            }
        );
        this.queue = [];
        this.backtracking = undefined;
    }

    public nextStep(): Node[][] {
        const currLoc = this.queue.shift();
        if (this.backtracking !== undefined) {
            if (this.backtracking.status === 2) {
                // Goal found.
                return null;
            } else {
                // Choosing the neighbour with the lowest weight.
                const nextLoc = this.getNeighbours(this.backtracking, 1).reduce(
                    (lowest, current) => {
                        if (
                            current.weight !== null &&
                            (lowest === null || current.weight < lowest.weight)
                        ) {
                            return current;
                        }
                        return lowest;
                    },
                    null
                );
                this.paintNode(nextLoc.x, nextLoc.y, 8);
                this.backtracking = nextLoc;
                return this.grid;
            }
        } else {
            const neighbours = this.getNeighbours(currLoc, 1).filter((neighbour) => {
                return neighbour.status !== 1;
            });
            const currWeight = this.grid[currLoc.x][currLoc.y].weight;
            neighbours.forEach((neighbour) => {
                if (neighbour.status === 3) {
                    this.backtracking = neighbour;
                } else if (this.grid[neighbour.x][neighbour.y].weight === null) {
                    this.grid[neighbour.x][neighbour.y].weight = currWeight + 1;
                    this.queue.push(neighbour);
                }
            });
            return this.grid;
        }
    }
    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        // Just to start the count to start from 0
        const changedStartLoc = new GridLocation(
            startLocation.x,
            startLocation.y,
            0,
            startLocation.status
        );
        this.queue.push(changedStartLoc);

        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j].status !== 2) {
                    this.grid[i][j].weight = null;
                }
            }
        }
    }
    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.queue = deserializedState.queue;
        this.backtracking = deserializedState.backtracking;
    }
    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const queue: GridLocation[] = [];
        let backtracking: GridLocation | undefined = undefined;
        if (serializedState.backtracking) {
            backtracking = new GridLocation(
                serializedState.backtracking.x,
                serializedState.backtracking.y,
                serializedState.backtracking.weight,
                serializedState.backtracking.status
            );
        }

        const deserializedState = {
            queue: [],
            backtracking: backtracking
        };
        serializedState.queue.forEach((item) => {
            const visitedNode = new GridLocation(item.x, item.y, item.weight);
            queue.push(visitedNode);
        });
        this.updateState(newGrid, deserializedState, statRecords);
    }
    public serialize(): Object {
        let backtrackingObj: object | undefined = undefined;
        if (this.backtracking) {
            backtrackingObj = this.backtracking.toObject();
        }
        const serializedState = {
            queue: [],
            backtracking: backtrackingObj
        };
        this.queue.forEach((gridLocation) => {
            serializedState.queue.push(gridLocation.toObject());
        });

        return serializedState;
    }
    public getState(): Object {
        return { queue: this.queue, backtracking: this.backtracking };
    }
    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Maze-Routing';
    }
    public usesNodeWeights(): boolean {
        return true;
    }
    public usesHeuristics(): boolean {
        return false;
    }
    public usesPathFindingSettings(): boolean {
        return false;
    }
    public forcesDiagonalMovement(): boolean {
        return false;
    }
}
