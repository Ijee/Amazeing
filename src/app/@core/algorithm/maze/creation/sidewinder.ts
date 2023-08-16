import { Node, StatRecord, MazeAlgorithm } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';

/**
 * The Sidewinder implementation to create mazes.
 * TODO this surely needs a refactoring but keep in mind the grids length can be even or odd.
 */
export class Sidewinder extends MazeAlgorithmAbstract {
    private cursor: GridLocation;
    private runSet: GridLocation[];

    constructor() {
        super(
            [],
            [
                {
                    name: 'Run Set Size',
                    type: 'status-none',
                    currentValue: 0
                },
                {
                    name: 'Run Set',
                    type: 'status-5'
                }
            ],
            {
                controls: []
            },
            {}
        );
        this.runSet = [];
    }

    /**
     * Selects the next cursor because I am not sure if the grid
     * will always be odd or even length wise because some guy (@ijee)
     * might change it on a whim.
     * Can probably be written in less loc.
     * @param oldX the old x coordinate
     * @param oldY the old y coordinate
     * @private
     */
    private selectNextCursor(oldX: number, oldY: number): GridLocation {
        let newCursor = null;
        if (oldX === this.currentGrid.length - 1) {
            newCursor = new GridLocation(0, oldY + 2);
        } else if (oldX >= this.currentGrid.length - 2) {
            newCursor = new GridLocation(oldX + 1, oldY);
        } else {
            // console.log('skipping?');
            newCursor = new GridLocation(oldX + 2, oldY);
        }
        return newCursor;
    }

    private buildEastward(drawRunSet: boolean): void {
        this.buildWalls(this.cursor, 0);
        let newStatus = drawRunSet ? 5 : 9;
        this.currentGrid[this.cursor.x][this.cursor.y].status = newStatus;
        if (
            this.currentGrid?.[this.cursor.x + 1]?.[this.cursor.y] !== undefined &&
            this.currentGrid?.[this.cursor.x + 1]?.[this.cursor.y].status !== 2 &&
            this.currentGrid?.[this.cursor.x + 1]?.[this.cursor.y].status !== 3
        ) {
            this.currentGrid[this.cursor.x + 1][this.cursor.y].status = newStatus;
        }
    }

    /**
     * Repaints the run set back to normal.
     * @private
     */
    private carveAndRestore(): void {
        if (this.runSet.length !== 0) {
            const randomElement = this.runSet[Math.floor(Math.random() * this.runSet.length)];
            this.currentGrid[randomElement.x][randomElement.y - 1].status = 9;
        }
        for (let i = 0; i < this.runSet.length; i++) {
            const node = this.runSet[i];
            this.currentGrid[node.x][node.y].status = 9;
            if (this.currentGrid?.[node.x + 1]?.[node.y] !== undefined) {
                this.currentGrid[node.x + 1][node.y].status = 9;
            }
        }
    }

    public nextStep(): Node[][] {
        if (
            this.cursor.y === this.currentGrid[0].length - 1 &&
            this.cursor.x === this.currentGrid.length - 1
        ) {
            this.carveAndRestore();
            // Not sure how to differentiate the last step and when it is really done.
            // IT'S OVER 9000!
            this.cursor = new GridLocation(0, 9001);
            return this.currentGrid;
        }
        if (this.cursor.y > this.currentGrid[0].length - 1) {
            return null;
        }

        if (!this.currentGrid[this.cursor.x][this.cursor.y - 1]) {
            this.buildEastward(false);
            this.cursor = this.selectNextCursor(this.cursor.x, this.cursor.y);
        } else {
            let coinFlip = Math.floor(Math.random() * 2) + 1;
            // build eastward
            if (coinFlip === 1 || this.runSet.length === 0) {
                this.buildEastward(true);
                this.runSet.push(this.cursor);
                this.cursor = this.selectNextCursor(this.cursor.x, this.cursor.y);
            } else {
                // carve north from run set
                this.carveAndRestore();
                // paint the wall
                if (
                    this.currentGrid?.[this.cursor.x - 1]?.[this.cursor.y] !== undefined &&
                    this.currentGrid[this.cursor.x][this.cursor.y].status !== 2 &&
                    this.currentGrid[this.cursor.x][this.cursor.y].status !== 3
                ) {
                    this.currentGrid[this.cursor.x - 1][this.cursor.y].status = 1;
                }
                this.runSet = [];
            }
        }
        // Yeah, yeah I know it's not length * 2, but it's all smoke and mirrors around here.
        this.statRecords[0].currentValue = this.runSet.length * 2;
        return this.currentGrid;
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;

        this.cursor = new GridLocation(
            0,
            0,
            this.currentGrid[0][0].weight,
            this.currentGrid[0][0].status
        );

        this.buildWalls(currentStartPoint);
    }

    public updateAlgorithmState(
        newGrid: Node[][],
        deserializedState: any,
        statRecords: StatRecord[]
    ): void {
        this.currentGrid = newGrid;
        this.statRecords = statRecords;
        this.cursor = deserializedState.cursor;
        this.runSet = deserializedState.runSet;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: StatRecord[]): void {
        const cursor = serializedState.cursor;
        const runSet: GridLocation[] = [];
        serializedState.runSet.forEach((item) => {
            const tempGridSnapShot = new GridLocation(item.x, item.y, item.weight);
            runSet.push(tempGridSnapShot);
        });

        const deserializedState = {
            cursor: new GridLocation(cursor.x, cursor.y, cursor.weight),
            runSet: runSet
        };
        this.updateAlgorithmState(newGrid, deserializedState, statRecords);
    }

    public getSerializedState(): Object {
        const serializedState = {
            cursor: this.cursor.toObject(),
            runSet: []
        };
        this.runSet.forEach((gridLocation) => {
            serializedState.runSet.push(gridLocation.toObject());
        });

        return serializedState;
    }

    public getCurrentAlgorithmState(): Object {
        return {
            cursor: this.cursor,
            runSet: this.runSet
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Sidewinder';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
