import { MazeAlgorithm, Node, Statistic } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';

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
            }
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
        if (oldX === this.grid.length - 1) {
            newCursor = new GridLocation(0, oldY + 2);
        } else if (oldX >= this.grid.length - 2) {
            newCursor = new GridLocation(oldX + 1, oldY);
        } else {
            newCursor = new GridLocation(oldX + 2, oldY);
        }
        return newCursor;
    }

    private buildEastward(drawRunSet: boolean): void {
        this.buildWalls(this.cursor, 0);
        let newStatus = drawRunSet ? 5 : 9;
        this.grid[this.cursor.x][this.cursor.y].status = newStatus;
        if (this.grid?.[this.cursor.x + 1]?.[this.cursor.y] !== undefined) {
            this.paintNode(this.cursor.x + 1, this.cursor.y, newStatus);
        }
    }

    /**
     * Repaints the run set back to normal.
     * @private
     */
    private carveAndRestore(): void {
        if (this.runSet.length !== 0) {
            const randomElement = this.runSet[Math.floor(Math.random() * this.runSet.length)];
            this.paintNode(randomElement.x, randomElement.y - 1, 9);
        }
        for (let i = 0; i < this.runSet.length; i++) {
            const node = this.runSet[i];
            this.grid[node.x][node.y].status = 9;
            if (this.grid?.[node.x + 1]?.[node.y] !== undefined) {
                this.paintNode(node.x + 1, node.y, 9);
            }
        }
    }

    public nextStep(): Node[][] {
        if (this.cursor.y === this.grid[0].length - 1 && this.cursor.x === this.grid.length - 1) {
            this.carveAndRestore();
            // Not sure how to differentiate the last step and when it is really done.
            // IT'S OVER 9000!
            this.cursor = new GridLocation(0, 9001);
            return this.grid;
        }
        if (this.cursor.y > this.grid[0].length - 1) {
            return null;
        }

        if (!this.grid[this.cursor.x][this.cursor.y - 1]) {
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
                if (this.grid?.[this.cursor.x - 1]?.[this.cursor.y] !== undefined) {
                    // this.grid[this.cursor.x - 1][this.cursor.y].status = 1;
                    this.paintNode(this.cursor.x - 1, this.cursor.y, 1);
                }
                this.runSet = [];
            }
        }
        // Yeah, yeah I know it's not length * 2, but it's all smoke and mirrors around here.
        this.statRecords[0].currentValue = this.runSet.length * 2;
        return this.grid;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;

        this.cursor = new GridLocation(0, 0, this.grid[0][0].weight, this.grid[0][0].status);

        this.buildWalls(startLocation);
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
        this.cursor = deserializedState.cursor;
        this.runSet = deserializedState.runSet;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
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
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        const serializedState = {
            cursor: this.cursor.toObject(),
            runSet: []
        };
        this.runSet.forEach((gridLocation) => {
            serializedState.runSet.push(gridLocation.toObject());
        });

        return serializedState;
    }

    public getState(): Object {
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
