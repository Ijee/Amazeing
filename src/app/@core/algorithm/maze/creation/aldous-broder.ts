import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { GridLocation } from '../../../../@shared/classes/GridLocation';
import { MazeAlgorithm, Node, Statistic } from '../../../types/algorithm.types';

export class AldousBroder extends MazeAlgorithmAbstract {
    private gridWith: number;
    private gridHeight: number;
    private cursor: GridLocation;
    private remainingNodes: number;

    constructor() {
        super(
            [],
            [
                {
                    name: 'Current Cursor',
                    type: 'status-4'
                },
                {
                    name: 'Found Nodes',
                    type: 'status-5'
                },
                {
                    name: 'Remaining Nodes',
                    type: 'status-none',
                    currentValue: 0
                },
                {
                    name: 'Building Streak',
                    type: 'status-none',
                    currentValue: 0
                }
            ],
            {
                controls: []
            }
        );
    }

    nextStep(): Node[][] | null {
        if (this.remainingNodes > 0) {
            const neighbours = this.getNeighbours(this.cursor, 2);
            const randomNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
            // Move the cursor position and visual representation to the next node.
            const oldCursor = this.cursor;
            const cursorNode = this.grid[this.cursor.x][this.cursor.y];
            const cursorStatus = cursorNode.status;
            if (cursorStatus === 4) {
                cursorNode.status = 5;
            }
            this.cursor = randomNeighbour;
            const newCursorNode = this.grid[this.cursor.x][this.cursor.y];
            const newCursorNodeStatus = newCursorNode.status;
            // Could be with an logical OR but the stats showing for
            // this algorithm is making it kind of meh because it sets the cursor
            // before building the walls so it always has the wrong amount of remainingNodes otherwise.
            // Potential TODO but would require more changes especially for the buildWalls function.
            if (newCursorNodeStatus === 0) {
                this.remainingNodes--;
                this.statRecords[2].currentValue--;
                this.statRecords[3].currentValue++;
                newCursorNode.status = 4;
            } else if (newCursorNodeStatus === 5) {
                newCursorNode.status = 4;
                this.statRecords[3].currentValue = 0;
            }

            if (newCursorNodeStatus === 0) {
                const statusChange = this.buildWalls(randomNeighbour, 0);
                this.buildPath(oldCursor, randomNeighbour, 5);
                this.statRecords[2].currentValue -= statusChange.status0;
                this.remainingNodes -= statusChange.status0;
            }
            return this.grid;
        } else {
            return null;
        }
    }

    setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        this.gridWith = this.grid.length;
        this.gridHeight = this.grid[0].length;
        // Note: the start and goal do not get counted so - 2 is necessary
        // for the break condition to work
        this.remainingNodes = this.gridWith * this.gridHeight - 2;
        this.statRecords[2].currentValue = this.remainingNodes;

        this.cursor = startLocation;
        const statusChange = this.buildWalls(startLocation, 0);
        this.statRecords[2].currentValue -= statusChange.status0;
        this.remainingNodes -= statusChange.status0;
    }

    updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
        this.cursor = deserializedState.cursor;
        this.remainingNodes = deserializedState.remainingNodes;
    }

    deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        let cursor: GridLocation | object;
        if (serializedState.cursor) {
            cursor = new GridLocation(
                serializedState.cursor.x,
                serializedState.cursor.y,
                serializedState.cursor.weight
            );
        }
        const deserializedState = {
            cursor: cursor,
            remainingNodes: serializedState.remainingNodes
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }

    serialize(): Object {
        let cursor: object | undefined = undefined;
        if (this.cursor) {
            cursor = this.cursor.toObject();
        }
        const serializedState = {
            cursor: cursor,
            remainingNodes: this.remainingNodes
        };
        return serializedState;
    }

    getState(): Object {
        return {
            cursor: this.cursor,
            remainingNodes: this.remainingNodes
        };
    }

    getAlgorithmName(): MazeAlgorithm {
        return 'Aldous-Broder';
    }

    usesNodeWeights(): boolean {
        return false;
    }
}
