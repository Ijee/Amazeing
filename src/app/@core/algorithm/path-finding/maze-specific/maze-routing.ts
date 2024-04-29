import {
    Node,
    PathFindingHeuristic,
    Statistic,
    PathFindingAlgorithm
} from 'src/app/@core/types/algorithm.types';
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
                console.log('backtracking node', this.backtracking);
                return this.grid;
            }
        } else {
            const neighbours = this.getNeighbours(currLoc, 1).filter((neighbour) => {
                return neighbour.status !== 1;
            });
            // TODO: Sort neighbours to north, east, south, west.
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
        // This forces the count to start from 0.
        const changedStartLoc = new GridLocation(
            startLocation.x,
            startLocation.y,
            0,
            startLocation.status
        );
        console.log(startLocation);
        this.queue.push(changedStartLoc);
        // So no other node weights are shown.
        // TODO: Make it work with weighted graph
        // + rename algorithm?
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
        throw new Error('Method not implemented.');
    }
    public serialize(): Object {
        throw new Error('Method not implemented.');
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
}
