import { Direction, MazeAlgorithm, Node, Statistic } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';

export class BinaryTree extends MazeAlgorithmAbstract {
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
        // this.grid[xAxis][yAxis].status = 9;
        this.paintNode(xAxis, yAxis, 9);
        switch (direction) {
            case 'up':
                this.paintNode(xAxis, yAxis - 1, 9);
                break;
            case 'right':
                this.paintNode(xAxis + 1, yAxis, 9);
                break;
            case 'down':
                this.paintNode(xAxis, yAxis + 1, 9);
                break;
            case 'left':
                this.paintNode(xAxis - 1, yAxis, 9);
                break;
            default:
                throw new Error('Unknown Direction!');
        }
    }
    public nextStep(): Node[][] {
        // grid.length is number of columns (width)
        // grid[0].length is number of rows (height)

        for (let i = 0; i < this.grid[0].length; i++) {
            // Iterate rows (y-axis)
            for (let j = 0; j < this.grid.length; j++) {
                // Iterate columns (x-axis)
                if (this.grid[j][i].status === 0) {
                    let chosenDirection: Direction | null = null;

                    const hasUpNeighbor = i > 0;
                    const hasLeftNeighbor = j > 0;

                    // Determine possible directions based on bias and boundaries
                    const potentialDirections: Direction[] = [];

                    switch (this.options.Bias) {
                        case 'North-West':
                            if (hasUpNeighbor) potentialDirections.push('up');
                            if (hasLeftNeighbor) potentialDirections.push('left');
                            break;
                        case 'North-East':
                            if (hasUpNeighbor) potentialDirections.push('up');
                            if (j < this.grid.length - 1) potentialDirections.push('right'); // Check if has right neighbor
                            break;
                        case 'South-West':
                            if (i < this.grid[0].length - 1) potentialDirections.push('down'); // Check if has down neighbor
                            if (hasLeftNeighbor) potentialDirections.push('left');
                            break;
                        case 'South-East':
                            if (i < this.grid[0].length - 1) potentialDirections.push('down');
                            if (j < this.grid.length - 1) potentialDirections.push('right');
                            break;
                    }

                    // Apply "must carve" rule for boundaries
                    if (potentialDirections.length === 0) {
                        this.paintNode(i, j, 9);
                    } else if (potentialDirections.length === 1) {
                        chosenDirection = potentialDirections[0]; // Must carve in the only possible direction
                    } else {
                        // Randomly choose between the two available directions (this.direction1, this.direction2)
                        const coinFlip = Math.floor(Math.random() * 2) + 1;
                        if (coinFlip === 1) {
                            chosenDirection = potentialDirections[0];
                        } else {
                            chosenDirection = potentialDirections[1];
                        }

                        // chosenDirection =
                        //     potentialDirections[
                        //         Math.floor(Math.random() * potentialDirections.length)
                        //     ];
                    }

                    if (chosenDirection) {
                        this.buildDirection(j, i, chosenDirection);
                    } else {
                        // This cell has no available directions to carve
                        this.paintNode(j, i, 9);
                    }
                    return this.grid;
                }
            }
        }
        return null;
    }

    public setInitialData(grid: Node[][]): void {
        this.grid = grid;
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const deserializedState = {};

        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): object {
        return {};
    }

    public getState(): object {
        return {};
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Binary-Tree';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
