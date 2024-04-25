import {
    Node,
    PathFindingHeuristic,
    Statistic,
    PathFindingAlgorithm
} from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { PathFindingAlgorithmAbstract } from '../path-finding-algorithm.abstract';

export class DeadEndFilling extends PathFindingAlgorithmAbstract {
    private deadEnds: GridLocation[];
    private fill: boolean;
    constructor() {
        super(
            [],
            [
                {
                    name: 'Dead Ends Filled',
                    type: 'status-5'
                }
            ],
            {
                controls: []
            },
            {},
            'None'
        );
        this.deadEnds = [];
    }

    /**
     * Checks the whole grid for dead ends and returns it.
     *
     * @returns all dead ends found
     */
    private findDeadEnds(): GridLocation[] {
        const deadEnds: GridLocation[] = [];
        for (let i = 0; i < this.currentGrid.length; i++) {
            for (let j = 0; j < this.currentGrid[0].length; j++) {
                const loc = new GridLocation(i, j);
                if (this.currentGrid[loc.x][loc.y].status !== 1) {
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
        if (filteredNeighbours.length >= 2) {
            return null;
        } else if (filteredNeighbours.length === 1) {
            this.paintNode(loc.x, loc.y, 5);
            return filteredNeighbours[filteredNeighbours.length - 1];
        } else if (filteredNeighbours.length === 0) {
            return null;
        }
    }

    public nextStep(): Node[][] {
        if (this.deadEnds.length === 0) {
            console.log('in finddeadends secftion');
            this.deadEnds = this.findDeadEnds();
            console.log(this.deadEnds.length);
            for (let i = 0; i < this.deadEnds.length; i++) {
                const deadEnd = this.deadEnds[i];
                this.paintNode(deadEnd.x, deadEnd.y, 5);
            }
        } else {
            const nextDeadEnds: GridLocation[] = [];
            for (let i = 0; i < this.deadEnds.length; i++) {
                const loc = this.deadEnds[i];
                const newLoc = this.fillDeadEnd(loc);
                if (newLoc !== null) {
                    nextDeadEnds.push(newLoc);
                }
            }
            this.deadEnds = nextDeadEnds;
        }

        return this.currentGrid;
    }
    public setInitialData(
        currentGrid: Node[][],
        currentStartPoint: GridLocation,
        pathfindingHeuristic: PathFindingHeuristic
    ): void {
        this.currentGrid = currentGrid;
    }
    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.currentGrid = newGrid;
        this.statRecords = statRecords;
    }
    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        throw new Error('Method not implemented.');
    }
    public serialize(): Object {
        throw new Error('Method not implemented.');
    }
    public getState(): Object {
        return { deadEnds: this.deadEnds, fill: this.fill };
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
}
