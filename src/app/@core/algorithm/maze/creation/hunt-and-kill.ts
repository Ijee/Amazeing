import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { shuffleFisherYates } from '../../../../@shared/utils/fisher-yates';
import { MazeAlgorithm, Node, Statistic } from '../../../types/algorithm.types';

export class HuntAndKill extends MazeAlgorithmAbstract {
    private cursor: GridLocation;
    private gridSnapshot: GridLocation[];
    private scanAtY: number;
    private evenOrOddX: number;
    private randomWalk: boolean;
    private nodeFound: boolean;

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
                    name: 'Selected Row',
                    type: 'status-8'
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
        this.gridSnapshot = [];
        this.scanAtY = 0;
        this.randomWalk = false;
        this.nodeFound = false;
    }

    /**
     *
     * @param row - the row to be
     * @private
     */
    private restoreRow(row: number): void {
        for (let i = 0; i < this.gridSnapshot.length; i++) {
            this.currentGrid[i][row].status = this.gridSnapshot[i].status;
        }
        this.gridSnapshot = [];
    }

    /**
     * Marks the whole row and paints the previous
     * @private
     */
    private markRow(): void {
        for (let i = 0; i < this.currentGrid.length; i++) {
            this.currentGrid[i][this.scanAtY].status = 6;
        }
    }

    public nextStep(): Node[][] {
        if (this.randomWalk) {
            let neighbours = this.getNeighbours(this.cursor, 2);
            neighbours = shuffleFisherYates(neighbours);
            this.randomWalk = false;
            for (let i = 0; i < neighbours.length; i++) {
                let neighbour = neighbours[i];
                if (neighbour.status === 0) {
                    this.buildWalls(neighbour, 0);
                    this.buildPath(this.cursor, neighbour, 5);
                    this.currentGrid[neighbour.x][neighbour.y].status = 5;
                    this.cursor = neighbour;
                    this.randomWalk = true;

                    return this.currentGrid;
                }
            }
        } else {
            // hunt mode  / search unused node
            if (this.scanAtY >= 1) {
                this.restoreRow(this.scanAtY - 1);
            }

            for (let i = 0; i < this.currentGrid.length; i++) {
                const loc = new GridLocation(
                    i,
                    this.scanAtY,
                    undefined,
                    this.currentGrid[i][this.scanAtY].status
                );
                this.gridSnapshot.push(loc);
                if (this.currentGrid[i][this.scanAtY].status === 0 && i % 2 === this.evenOrOddX) {
                    let neighbours = this.getNeighbours(loc, 2);
                    for (let j = 0; j < neighbours.length; j++) {
                        let neighbour = neighbours[j];
                        if (this.nodeFound && neighbour.status === 5) {
                            // when a node has been found we connect it to the existing grid
                            // after hunt and kill.

                            // man würde denken, dass ich nur beim cursor bauen
                            // und einen Weg zwischen neighbour und cursor machen müsste.
                            // bzw eigentlich loc und neighbour, aber ka
                            this.buildWalls(this.cursor, 0, 8);
                            this.buildWalls(loc, 5);
                            console.log('loc', loc);
                            console.log('neighbour', neighbour);
                            console.log('cursor', this.cursor);
                            this.buildPath(this.cursor, neighbour, 5);
                            this.currentGrid[this.cursor.x][this.cursor.y].status = 5;
                            this.randomWalk = true;
                            this.nodeFound = false;
                            this.scanAtY = 0;
                            this.gridSnapshot = [];
                            return this.currentGrid;
                        } else if (neighbour.status === 5) {
                            this.cursor = loc;
                            this.nodeFound = true;
                            break;
                        }
                    }
                }
            }
            // no viable node has been found, so we search the next row
            // during the following iteration
            if (!this.randomWalk) {
                this.markRow();
                if (this.nodeFound) {
                    this.currentGrid[this.cursor.x][this.cursor.y].status = 8;
                }
                this.scanAtY += 1;
            }
            return this.currentGrid;
        }
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;
        const randomXPosition = Math.floor(Math.random() * this.currentGrid.length);
        const randomYPosition = Math.floor(Math.random() * this.currentGrid[0].length);

        this.evenOrOddX = randomXPosition % 2;
        console.log(this.evenOrOddX);
        this.cursor = new GridLocation(randomXPosition, randomYPosition, 0);
        this.currentGrid[randomXPosition][randomYPosition].status = 5;
        this.buildWalls(this.cursor, 0);
        this.randomWalk = true;
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.currentGrid = newGrid;
        this.statRecords = statRecords;
        this.cursor = deserializedState.cursor;
        this.gridSnapshot = deserializedState.gridSnapshot;
        this.scanAtY = deserializedState.scanAtY;
        this.evenOrOddX = deserializedState.evenOrOddX;
        this.randomWalk = deserializedState.randomWalk;
        this.nodeFound = deserializedState.nodeFound;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const cursor = serializedState.cursor;
        const gridSnapShot: GridLocation[] = [];
        serializedState.walkingPath.forEach((item) => {
            const tempGridSnapShot = new GridLocation(item.x, item.y, item.weight);
            gridSnapShot.push(tempGridSnapShot);
        });

        const deserializedState = {
            cursor: new GridLocation(cursor.x, cursor.y, cursor.weight),
            gridSnapshot: gridSnapShot,
            scanAtY: serializedState.scanAtY,
            evenOrOddX: serializedState.evenOrOddX,
            randomWalk: serializedState.randomWalk,
            nodeFound: serializedState.nodeFound
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        const serializedState = {
            cursor: this.cursor.toObject(),
            gridSnapshot: [],
            scanAtY: this.scanAtY,
            evenOrOddX: this.evenOrOddX,
            randomWalk: this.randomWalk,
            nodeFound: this.nodeFound
        };
        this.gridSnapshot.forEach((gridLocation) => {
            serializedState.gridSnapshot.push(gridLocation.toObject());
        });

        return serializedState;
    }

    public getState(): Object {
        return {
            cursor: this.cursor,
            gridSnapshot: this.gridSnapshot,
            scanAtY: this.scanAtY,
            evenOrOddX: this.evenOrOddX,
            randomWalk: this.randomWalk,
            nodeFound: this.nodeFound
        };

        //
        //     private cursor: GridLocation;
        //     private scanAtY: number;
        // private evenOrOddX: number;
        //     private randomWalk: boolean;
        //     private nodeFound: boolean;
        //     private gridSnapshot: GridLocation[];
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Hunt-and-Kill';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
