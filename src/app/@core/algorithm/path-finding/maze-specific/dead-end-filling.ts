import {
    Node,
    PathFindingHeuristic,
    Statistic,
    PathFindingAlgorithm
} from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { PathFindingAlgorithmAbstract } from '../path-finding-algorithm.abstract';
import { HashSet } from 'src/app/@shared/classes/HashSet';

export class DeadEndFilling extends PathFindingAlgorithmAbstract {
    private deadEnds: GridLocation[];
    constructor() {
        super(
            [],
            [
                {
                    name: 'Filled node',
                    type: 'status-5'
                }
            ],
            {
                controls: []
            }
        );
    }

    /**
     * Checks the whole grid for dead ends and returns it.
     *
     * @returns all dead ends found
     */
    private findDeadEnds(): GridLocation[] {
        const deadEnds: GridLocation[] = [];
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                const loc = new GridLocation(i, j);
                if (this.grid[loc.x][loc.y].status !== 1) {
                    const neighbours = this.getNeighbours(loc, 1).filter((neighbour) => {
                        return neighbour.status !== 1;
                    });
                    if (neighbours.length === 1) {
                        deadEnds.push(loc);
                    }
                }
            }
        }
        return deadEnds;
    }

    /**
     * Attempts to fill the dead end and either returns the new GridLocation or
     * null if it is a junction
     *
     * @param loc the location to check
     * @returns returns a GridLocation when it could fill another neighbour node
     */
    private fillDeadEnd(loc: GridLocation): GridLocation | null {
        const filteredNeighbours = this.getNeighbours(loc, 1).filter((neighbour) => {
            return neighbour.status !== 1 && neighbour.status !== 5;
        });
        if (filteredNeighbours.length === 1) {
            this.paintNode(loc.x, loc.y, 5);
            return filteredNeighbours[0];
        }
    }

    public nextStep(): Node[][] {
        if (!this.deadEnds) {
            this.deadEnds = this.findDeadEnds();
            for (let i = 0; i < this.deadEnds.length; i++) {
                const deadEnd = this.deadEnds[i];
                this.paintNode(deadEnd.x, deadEnd.y, 5);
            }
        } else if (this.deadEnds.length === 0) {
            return null;
        } else {
            const nextDeadEnds: HashSet<GridLocation> = new HashSet<GridLocation>();
            for (let i = 0; i < this.deadEnds.length; i++) {
                const loc = this.deadEnds[i];
                const newLoc = this.fillDeadEnd(loc);
                if (newLoc) {
                    nextDeadEnds.add(newLoc);
                }
            }
            this.deadEnds = [...nextDeadEnds];
        }

        return this.grid;
    }
    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
    }
    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
        this.deadEnds = deserializedState.deadEnds;
    }
    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const deadEnds: GridLocation[] = [];
        serializedState.walkingPath.forEach((item) => {
            const deadEnd = new GridLocation(item.x, item.y, item.weight);
            deadEnds.push(deadEnd);
        });
        const deserializedState = {
            deadEnds: deadEnds
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }
    public serialize(): Object {
        const serializedState = {
            deadEnds: []
        };
        this.deadEnds.forEach((gridLocation) => {
            serializedState.deadEnds.push(gridLocation.toObject());
        });

        return serializedState;
    }

    public getState(): Object {
        return { deadEnds: this.deadEnds };
    }
    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Dead-End-Filling';
    }
    public usesNodeWeights(): boolean {
        return false;
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
