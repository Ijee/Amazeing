import { Node, Statistic, PathFindingAlgorithm } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { PathFindingAlgorithmAbstract } from '../path-finding-algorithm.abstract';

export class Tremaux extends PathFindingAlgorithmAbstract {
    private cursor: GridLocation;
    private visitedNodes: GridLocation[];
    constructor() {
        super(
            [],
            [
                {
                    name: 'Cursor',
                    type: 'status-8'
                },
                {
                    name: 'Path taken',
                    type: 'status-4'
                },
                {
                    name: 'Passages marked',
                    type: 'status-none',
                    currentValue: 0
                }
            ],
            {
                controls: []
            }
        );
        this.visitedNodes = [];
    }
    /**
     * Checks and marks an intersection that is defined as more than 2 elements
     * based on the algorithm rules and returns the next GridLocation for the next iteration.
     *
     * @param neighbours the neighbours of the current location
     * @param prevLoc the previous location
     * @returns the next GridLocation
     */
    private checkIntersection(neighbours: GridLocation[], prevLoc: GridLocation): GridLocation {
        const knownIntersection =
            neighbours.filter((neighbour) => {
                return !prevLoc.equals(neighbour) && neighbour.weight !== null;
            }).length >= 1
                ? true
                : false;

        const allMarked = neighbours.every((neighbour) => {
            return neighbour.weight >= 1;
        });

        if (!knownIntersection) {
            // 1. Unknown intersection.
            const withoutEntrance = neighbours.filter((neighbour) => {
                return !neighbour.equals(prevLoc);
            });
            const randomPassage =
                withoutEntrance[Math.floor(Math.random() * withoutEntrance.length)];

            this.grid[prevLoc.x][prevLoc.y].weight = 1;
            this.grid[randomPassage.x][randomPassage.y].weight = 1;
            return randomPassage;
        } else if (knownIntersection && prevLoc.weight === null) {
            // 2. Known intersection and unknown pathway to intersection.
            this.grid[prevLoc.x][prevLoc.y].weight += 1;
            return prevLoc;
        } else if (knownIntersection && prevLoc.weight === 1 && !allMarked) {
            // 3. Known intersection and pathway to intersection was already known.
            const unmarkedPassages = neighbours.filter((neighbour) => {
                return neighbour.weight === null;
            });
            this.grid[prevLoc.x][prevLoc.y].weight += 1;
            const randomUmarkedPassage =
                unmarkedPassages[Math.floor(Math.random() * unmarkedPassages.length)];
            this.grid[randomUmarkedPassage.x][randomUmarkedPassage.y].weight += 1;
            return randomUmarkedPassage;
        } else if (allMarked && prevLoc.weight === 1) {
            // 4. Known intersection and all at least marked with weight = 1.
            this.grid[prevLoc.x][prevLoc.y].weight += 1;

            // remove entrance to intersection and passage that has already been marked twice.
            const remainingPassages = neighbours.filter((neighbour) => {
                return !neighbour.equals(prevLoc) && neighbour.weight < 2;
            });
            const randomWeightedPassage =
                remainingPassages[Math.floor(Math.random() * remainingPassages.length)];
            this.grid[randomWeightedPassage.x][randomWeightedPassage.y].weight += 1;
            return randomWeightedPassage;
        }
    }
    /**
     * Checks if the node is an intersection.
     *
     * @param loc location to be checked
     * @returns whether it is an intersection
     */
    private isIntersection(loc: GridLocation): boolean {
        return;
    }

    public nextStep(): Node[][] {
        const prevLoc = this.visitedNodes[this.visitedNodes.length - 2];
        const currLoc = this.visitedNodes[this.visitedNodes.length - 1];
        // check if the new cursor is the goal
        if (currLoc.status === 3) {
            return null;
        }
        const neighbours = this.getNeighbours(currLoc, 1).filter((neighbour) => {
            return neighbour.status !== 1;
        });
        if (neighbours.length > 2) {
            // Intersection
            const nextLoc = this.checkIntersection(neighbours, prevLoc);
            this.paintNode(nextLoc.x, nextLoc.y, 7);
            this.paintNode(currLoc.x, currLoc.y, 0);
            this.visitedNodes.push(nextLoc);
        } else if (neighbours.length === 2) {
            // Move to next intersection.

            const nextLoc = neighbours.find((neighbour) => {
                return !neighbour.equals(prevLoc);
            });
            this.paintNode(nextLoc.x, nextLoc.y, 7);
            this.paintNode(currLoc.x, currLoc.y, 0);
            this.visitedNodes.push(nextLoc);
        } else {
            // Dead end. Turn around.
            const nextLoc = neighbours[neighbours.length - 1];
            this.paintNode(nextLoc.x, nextLoc.y, 7);
            this.paintNode(currLoc.x, currLoc.y, 0);
            this.visitedNodes.push(nextLoc);
        }

        return this.grid;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        // TODO: Adding it twice is stupid but works. blame @Ijee
        this.visitedNodes.push(startLocation, startLocation);
        // So no other node weights are shown.
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                this.grid[i][j].weight = null;
            }
        }
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.cursor = deserializedState.cursor;
        this.visitedNodes = deserializedState.visitedNodes;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const visitedNodes: GridLocation[] = [];
        let cursor: GridLocation | undefined = undefined;
        if (serializedState.cursor) {
            cursor = new GridLocation(
                serializedState.cursor.x,
                serializedState.cursor.y,
                serializedState.cursor.weight,
                serializedState.cursor.status
            );
        }

        serializedState.walkingPath.forEach((item) => {
            const visitedNode = new GridLocation(item.x, item.y, item.weight);
            visitedNodes.push(visitedNode);
        });
        const deserializedState = {
            cursor: new GridLocation(cursor.x, cursor.y, cursor.weight, cursor.status),
            visitedNodes: visitedNodes
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        let cursorObj: object | undefined = undefined;
        if (this.cursor) {
            cursorObj = this.cursor.toObject();
        }
        const serializedState = {
            cursor: cursorObj,
            visitedNodes: []
        };
        this.visitedNodes.forEach((gridLocation) => {
            serializedState.visitedNodes.push(gridLocation.toObject());
        });

        return serializedState;
    }

    public getState(): Object {
        return;
        {
            cursor: this.cursor;
            visitedNodes: this.visitedNodes;
        }
    }

    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Trémaux';
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
