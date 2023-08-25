import { MazeAlgorithm, Node, StatRecord } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';

export class BinaryTree extends MazeAlgorithmAbstract {
    // Actually, we don't have any state for the algorithm itself.
    // This is only for the algorithm options or rather for the directional loop to be exact.
    private buildDirection1: string;
    private buildDirection2: string;
    private xDirection: number;
    private yDirection: number;
    private xStart: number;
    private yStart: number;
    private xEnd: number;
    private yEnd: number;

    constructor() {
        super(
            [],
            [],
            {
                controls: [
                    {
                        name: 'Bias',
                        label: 'Bias',
                        value: 'Northwest',
                        values: ['Northwest', 'Northeast', 'Southwest', 'Southeast'],
                        type: 'select',
                        validators: {
                            required: true
                        }
                    }
                ]
            },
            {}
        );
    }

    /**
     *
     * @param xAxis
     * @param yAxis
     * @param direction
     * @private
     */
    private buildDirection(xAxis: number, yAxis: number, direction: string): void {
        const loc = new GridLocation(xAxis, yAxis);
        this.buildWalls(loc, 0);
        this.currentGrid[xAxis][yAxis].status = 9;
        switch (direction) {
            case 'top':
                if (
                    this.currentGrid?.[xAxis]?.[yAxis - 1] !== undefined &&
                    this.currentGrid?.[xAxis]?.[yAxis - 1].status !== 2 &&
                    this.currentGrid?.[xAxis]?.[yAxis - 1].status !== 3
                ) {
                    this.currentGrid[xAxis][yAxis - 1].status = 9;
                }
                break;
            case 'right':
                if (
                    this.currentGrid?.[xAxis + 1]?.[yAxis] !== undefined &&
                    this.currentGrid?.[xAxis + 1]?.[yAxis].status !== 2 &&
                    this.currentGrid?.[xAxis + 1]?.[yAxis].status !== 3
                ) {
                    this.currentGrid[xAxis + 1][yAxis].status = 9;
                }
                break;
            case 'down':
                if (
                    this.currentGrid?.[xAxis]?.[yAxis + 1] !== undefined &&
                    this.currentGrid?.[xAxis]?.[yAxis + 1].status !== 2 &&
                    this.currentGrid?.[xAxis]?.[yAxis + 1].status !== 3
                ) {
                    this.currentGrid[xAxis][yAxis + 1].status = 9;
                }
                break;
            case 'left':
                if (
                    this.currentGrid?.[xAxis - 1]?.[yAxis] !== undefined &&
                    this.currentGrid?.[xAxis - 1]?.[yAxis].status !== 2 &&
                    this.currentGrid?.[xAxis - 1]?.[yAxis].status !== 3
                ) {
                    this.currentGrid[xAxis - 1][yAxis].status = 9;
                }
                break;
            default:
                throw new Error('Unknown Direction!');
        }
    }

    public nextStep(): Node[][] {
        for (let i = this.yStart; i !== this.yEnd; i += this.yDirection) {
            for (let j = this.xStart; j !== this.xEnd; j += this.xDirection) {
                if (this.currentGrid[j][i].status === 0) {
                    let coinFlip = Math.floor(Math.random() * 2) + 1;
                    if (coinFlip === 1) {
                        this.buildDirection(j, i, this.buildDirection1);
                        return this.currentGrid;
                    } else {
                        this.buildDirection(j, i, this.buildDirection2);
                        return this.currentGrid;
                    }
                }
            }
        }
        return null;
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;
        // Settings the options once.
        switch (this.options.Bias) {
            case 'Northwest':
                this.buildDirection1 = 'right';
                this.buildDirection2 = 'down';
                this.xDirection = 1;
                this.yDirection = 1;
                this.xStart = 0;
                this.yStart = 0;
                this.xEnd = this.currentGrid.length;
                this.yEnd = this.currentGrid[0].length;
                break;
            case 'Northeast':
                this.buildDirection1 = 'left';
                this.buildDirection2 = 'down';
                this.xDirection = -1;
                this.yDirection = 1;
                this.xStart = this.currentGrid.length;
                this.yStart = 0;
                this.xEnd = 0;
                this.yEnd = this.currentGrid[0].length;
                break;
            case 'Southwest':
                this.buildDirection1 = 'right';
                this.buildDirection2 = 'top';
                this.xDirection = 1;
                this.yDirection = -1;
                this.xStart = 0;
                this.yStart = this.currentGrid[0].length - 1;
                this.xEnd = this.currentGrid.length;
                this.yEnd = -1;
                break;
            case 'Southeast':
                this.buildDirection1 = 'left';
                this.buildDirection2 = 'top';
                this.xDirection = -1;
                this.yDirection = -1;
                this.xStart = this.currentGrid.length - 1;
                this.yStart = this.currentGrid[0].length - 1;
                this.xEnd = -1;
                this.yEnd = -1;
                break;
            default:
        }
    }

    public updateAlgorithmState(
        newGrid: Node[][],
        deserializedState: any,
        statRecords: StatRecord[]
    ): void {
        this.currentGrid = newGrid;
        this.statRecords = statRecords;
        this.buildDirection1 = deserializedState.buildDirection1;
        this.buildDirection2 = deserializedState.buildDirection2;
        this.xDirection = deserializedState.xDirection;
        this.yDirection = deserializedState.yDirection;
        this.xStart = deserializedState.xStart;
        this.yStart = deserializedState.yStart;
        this.xEnd = deserializedState.xEnd;
        this.yEnd = deserializedState.yEnd;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: StatRecord[]): void {
        const deserializedState = {
            buildDirection1: serializedState.buildDirection1,
            buildDirection2: serializedState.buildDirection2,
            xDirection: serializedState.xDirection,
            yDirection: serializedState.yDirection,
            xStart: serializedState.xStart,
            yStart: serializedState.yStart,
            xEnd: serializedState.xEnd,
            yEnd: serializedState.yEnd
        };
        this.updateAlgorithmState(newGrid, deserializedState, statRecords);
    }

    public getSerializedState(): Object {
        return {
            buildDirection1: this.buildDirection1,
            buildDirection2: this.buildDirection2,
            xDirection: this.xDirection,
            yDirection: this.yDirection,
            xStart: this.xStart,
            yStart: this.yStart,
            xEnd: this.xEnd,
            yEnd: this.yEnd
        };
    }

    public getCurrentAlgorithmState(): Object {
        return {
            buildDirection1: this.buildDirection1,
            buildDirection2: this.buildDirection2,
            xDirection: this.xDirection,
            yDirection: this.yDirection,
            xStart: this.xStart,
            yStart: this.yStart,
            xEnd: this.xEnd,
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
