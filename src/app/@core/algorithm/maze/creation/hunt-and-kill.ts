import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { shuffleFisherYates } from '../../../../@shared/utils/fisher-yates';
import { MazeAlgorithm, Node, Statistic } from '../../../types/algorithm.types';

export class HuntAndKill extends MazeAlgorithmAbstract {
    private cursor: GridLocation;
    private rowSnapshot: GridLocation[];
    private nodesFound: GridLocation[];
    private scanAtY: number;
    private evenOrOddX: number;
    private randomWalk: boolean;

    constructor() {
        super(
            [],
            [
                {
                    name: 'Random Connection',
                    type: 'status-4'
                },
                {
                    name: 'Visited Nodes',
                    type: 'status-5'
                },
                {
                    name: 'Selected Row',
                    type: 'status-6'
                },
                {
                    name: 'Building Streak',
                    type: 'status-none',
                    currentValue: 0
                },
                {
                    name: 'Viable Nodes',
                    type: 'status-8'
                }
            ],
            {
                controls: []
            }
        );
        this.rowSnapshot = [];
        this.nodesFound = [];
        this.scanAtY = 0;
        this.randomWalk = false;
    }

    /**
     *
     * @param row - the row to be
     * @private
     */
    private restoreRow(): void {
        for (let i = 0; i < this.rowSnapshot.length; i++) {
            const loc = this.rowSnapshot[i];
            this.grid[loc.x][loc.y].status = loc.status;
        }
        this.rowSnapshot = [];
    }

    /**
     * Scans a whole grid row for viable neighbours, saves the status and paints it over.
     *
     * @returns whether it found viable nodes.
     */
    private scanRow(): boolean {
        for (let i = 0; i < this.grid.length; i++) {
            const loc = new GridLocation(
                i,
                this.scanAtY,
                undefined,
                this.grid[i][this.scanAtY].status
            );
            // Save current row state
            this.rowSnapshot.push(loc);
            // if (this.grid[i][this.scanAtY].status === 0) {
            if (this.grid[i][this.scanAtY].status === 0 && i % 2 === this.evenOrOddX) {
                const neighbours = this.getNeighbours(loc, 2);
                for (let j = 0; j < neighbours.length; j++) {
                    const neighbour = neighbours[j];
                    if (neighbour.status === 5) {
                        // when a node has been found we connect it to the existing grid
                        // after hunt and kill.
                        this.nodesFound.push(loc);

                        this.paintNode(loc.x, loc.y, 8);
                    }
                }
            }
            // Mark location (basically marking the whole row but not the node that has been found)

            // TODDO: When custom node classes can be set in the algorithm itself this can be changed back.
            // Meaning we can put an overlay class instead of changing the status and then we will also get all viable neighbours.
            // if (!this.nodesFound.includes(loc)) {
            //     this.paintNode(loc.x, loc.y, 6);
            // }
        }
        // Mark whole row
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid[i][this.scanAtY].status !== 8) {
                this.paintNode(i, this.scanAtY, 6);
            }
        }

        return this.nodesFound.length === 0;
    }

    /**
     * Is responsible for the ranodmo walk.
     */
    private walk(): void {
        let neighbours = this.getNeighbours(this.cursor, 2);
        neighbours = shuffleFisherYates(neighbours);
        this.randomWalk = false;
        for (let i = 0; i < neighbours.length; i++) {
            const neighbour = neighbours[i];
            if (neighbour.status === 0) {
                this.buildWalls(neighbour, 0);
                this.buildPath(this.cursor, neighbour, 5);
                this.paintNode(neighbour.x, neighbour.y, 5);
                this.cursor = neighbour;
                this.randomWalk = true;
                this.statRecords[3].currentValue += 1;
                break;
            }
        }
        if (!this.randomWalk) {
            this.statRecords[3].currentValue = 0;
            this.scanAtY = 0;
        }
    }

    public nextStep(): Node[][] {
        if (this.scanAtY >= 0) {
            this.restoreRow();
        }
        if (this.scanAtY >= this.grid[0].length + 1) {
            return null;
        }

        if (this.randomWalk) {
            this.walk();
        } else {
            // hunt mode / search unused node
            if (this.nodesFound.length !== 0) {
                // Cconnecting the new start with the existing maze.
                this.restoreRow();
                const randomLoc =
                    this.nodesFound[Math.floor(Math.random() * this.nodesFound.length)];
                const viableNeighbour = this.getNeighbours(randomLoc, 2).find((neighbour) => {
                    return this.grid[neighbour.x][neighbour.y].status === 5;
                });
                this.buildWalls(randomLoc, 0);
                this.paintNode(randomLoc.x, randomLoc.y, 5);
                this.buildPath(viableNeighbour, randomLoc, 5);
                this.cursor = randomLoc;
                this.randomWalk = true;
                this.nodesFound = [];
                this.scanAtY = -1;
            } else {
                // So we paint back the last row when it's the last row and no viable nodes have been found.
                if (this.scanAtY >= this.grid[0].length && this.nodesFound.length === 0) {
                    this.restoreRow();
                    this.scanAtY += 1;
                    return this.grid;
                }
                const nextRow = this.scanRow();

                // nextRow ? (this.scanAtY += 1) : (this.scanAtY = 0);
                this.scanAtY = nextRow ? this.scanAtY + 1 : 0;
            }
        }
        return this.grid;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        const randomXPosition = Math.floor(Math.random() * this.grid.length);
        const randomYPosition = Math.floor(Math.random() * this.grid[0].length);

        this.evenOrOddX = randomXPosition % 2;
        this.cursor = new GridLocation(randomXPosition, randomYPosition, 0);
        this.grid[randomXPosition][randomYPosition].status = 5;
        this.buildWalls(this.cursor, 0);
        this.randomWalk = true;
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
        this.cursor = deserializedState.cursor;
        this.rowSnapshot = deserializedState.rowSnapshot;
        this.nodesFound = deserializedState.nodesFound;
        this.scanAtY = deserializedState.scanAtY;
        this.evenOrOddX = deserializedState.evenOrOddX;
        this.randomWalk = deserializedState.randomWalk;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        let cursor = serializedState.cursor;
        if (serializedState.cursor) {
            cursor = new GridLocation(cursor.x, cursor.y, cursor.weight);
        }
        const tempRowSnapshot: GridLocation[] = [];
        if (serializedState.rowSnapshot.lengh !== 0) {
            serializedState.rowSnapshot.forEach((item) => {
                const node = new GridLocation(item.x, item.y, item.weight, item.status);
                tempRowSnapshot.push(node);
            });
        }
        const tempNodesFound: GridLocation[] = [];
        if (serializedState.nodesFound.length !== 0) {
            serializedState.nodesFound.forEach((item) => {
                const node = new GridLocation(item.x, item.y, item.weight, item.status);
                tempNodesFound.push(node);
            });
        }
        const deserializedState = {
            cursor: new GridLocation(cursor.x, cursor.y, cursor.weight),
            rowSnapshot: tempRowSnapshot,
            nodesFound: tempNodesFound,
            scanAtY: serializedState.scanAtY,
            evenOrOddX: serializedState.evenOrOddX,
            randomWalk: serializedState.randomWalk
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): object {
        let cursor: object | undefined = undefined;
        if (this.cursor) {
            cursor = JSON.parse(JSON.stringify(this.cursor));
        }

        const serializedState = {
            cursor: cursor,
            rowSnapshot: [],
            nodesFound: [],
            scanAtY: this.scanAtY,
            evenOrOddX: this.evenOrOddX,
            randomWalk: this.randomWalk
        };
        if (this.rowSnapshot.length !== 0)
            this.rowSnapshot.forEach((gridLocation) => {
                serializedState.rowSnapshot.push(gridLocation.toObject());
            });

        if (this.nodesFound.length !== 0) {
            this.nodesFound.forEach((gridLocation) => {
                serializedState.nodesFound.push(gridLocation.toObject());
            });
        }

        return serializedState;
    }

    public getState(): object {
        return {
            cursor: this.cursor,
            rowSnapshot: this.rowSnapshot,
            nodesFound: this.nodesFound,
            scanAtY: this.scanAtY,
            evenOrOddX: this.evenOrOddX,
            randomWalk: this.randomWalk
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Hunt-and-Kill';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
