import { Direction, MazeAlgorithm, Node, Statistic } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';

export class BinaryTree extends MazeAlgorithmAbstract {
    // Actually, we don't have any state for the algorithm itself.
    // This is only for the algorithm options or rather for the directional loop to be exact.
    private direction1: Direction;
    private direction2: Direction;
    private yStart: number;
    private yEnd: number;

    constructor() {
        super([], [], {
            controls: [
                {
                    name: 'Bias',
                    label: 'Bias',
                    value: 'North-West',
                    values: ['North-West', 'North-East', 'South-West', 'South-East'],
                    type: 'select',
                    validators: {
                        required: true
                    }
                }
            ]
        });
    }

    /**
     *
     * @param xAxis
     * @param yAxis
     * @param direction
     * @private
     */
    private buildDirection(xAxis: number, yAxis: number, direction: Direction): void {
        const loc = new GridLocation(xAxis, yAxis);
        this.buildWalls(loc, 0);
        this.grid[xAxis][yAxis].status = 9;
        switch (direction) {
            case 'up':
                if (
                    this.grid?.[xAxis]?.[yAxis - 1] !== undefined &&
                    this.grid?.[xAxis]?.[yAxis - 1].status !== 2 &&
                    this.grid?.[xAxis]?.[yAxis - 1].status !== 3
                ) {
                    this.grid[xAxis][yAxis - 1].status = 9;
                }
                break;
            case 'right':
                if (
                    this.grid?.[xAxis + 1]?.[yAxis] !== undefined &&
                    this.grid?.[xAxis + 1]?.[yAxis].status !== 2 &&
                    this.grid?.[xAxis + 1]?.[yAxis].status !== 3
                ) {
                    this.grid[xAxis + 1][yAxis].status = 9;
                }
                break;
            case 'down':
                if (
                    this.grid?.[xAxis]?.[yAxis + 1] !== undefined &&
                    this.grid?.[xAxis]?.[yAxis + 1].status !== 2 &&
                    this.grid?.[xAxis]?.[yAxis + 1].status !== 3
                ) {
                    this.grid[xAxis][yAxis + 1].status = 9;
                }
                break;
            case 'left':
                if (
                    this.grid?.[xAxis - 1]?.[yAxis] !== undefined &&
                    this.grid?.[xAxis - 1]?.[yAxis].status !== 2 &&
                    this.grid?.[xAxis - 1]?.[yAxis].status !== 3
                ) {
                    this.grid[xAxis - 1][yAxis].status = 9;
                }
                break;
            default:
                throw new Error('Unknown Direction!');
        }
    }

    public nextStep(): Node[][] {
        for (let i = this.yStart; i < this.yEnd; i++) {
            for (let j = 0; j < this.grid.length; j++) {
                if (this.grid[j][i].status === 0) {
                    let coinFlip = Math.floor(Math.random() * 2) + 1;

                    if (coinFlip === 1) {
                        this.buildDirection(j, i, this.direction1);
                        return this.grid;
                    } else {
                        this.buildDirection(j, i, this.direction2);
                        return this.grid;
                    }
                }
            }
        }
        return null;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        // Settings the options once.
        switch (this.options.Bias) {
            case 'North-West':
                this.direction1 = 'up';
                this.direction2 = 'left';
                this.yStart = 2;
                this.yEnd = this.grid[0].length;
                break;
            case 'North-East':
                this.direction1 = 'up';
                this.direction2 = 'right';
                this.yStart = 2;
                this.yEnd = this.grid[0].length;
                break;
            case 'South-West':
                this.direction1 = 'down';
                this.direction2 = 'left';
                this.yStart = 0;
                this.yEnd = this.grid[0].length - 1;
                break;
            case 'South-East':
                this.direction1 = 'down';
                this.direction2 = 'right';
                this.yStart = 0;
                this.yEnd = this.grid[0].length - 1;
                break;
            default:
        }
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
        this.direction1 = deserializedState.direction1;
        this.direction2 = deserializedState.direction2;
        this.yStart = deserializedState.yStart;
        this.yEnd = deserializedState.yEnd;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const deserializedState = {
            direction1: serializedState.direction1,
            direction2: serializedState.direction2,
            yStart: serializedState.yStart,
            yEnd: serializedState.yEnd
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        return {
            direction1: this.direction1,
            direction2: this.direction2,
            yStart: this.yStart,
            yEnd: this.yEnd
        };
    }

    public getState(): Object {
        return {
            direction1: this.direction1,
            direction2: this.direction2,
            yStart: this.yStart,
            yEnd: this.yEnd
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Binary-Tree';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
