import {
    MazeAlgorithm,
    Node,
    Orientation,
    Parity,
    Statistic
} from 'src/app/@core/types/algorithm.types';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { getRandomIntInclusive } from '../../../../@shared/utils/general-utils';

interface Division {
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
}

export class RecursiveDivision extends MazeAlgorithmAbstract {
    private divisions: Division[];
    // So that we divide the "correct way" in an odd or even grid width/length.
    private xParity: Parity;
    private yParity: Parity;

    constructor() {
        super([], [], {
            controls: []
        });
    }

    /**
     * Chooses in which direction to divide the next section.
     *
     * @param width the width
     * @param height the height
     * @private
     */
    private chooseOrientation(width: number, height: number): Orientation {
        let direction: Orientation;
        if (width < height) {
            direction = 'horizontal';
        } else if (height < width) {
            direction = 'vertical';
        } else {
            direction = Math.round(Math.random()) === 0 ? 'horizontal' : 'vertical';
        }
        return direction;
    }

    /**
     * Divides a subdivision and adds both resulting subdivisions for the next step.
     *
     * @param division the subdivision
     * @param orientation the orientation to divide
     * @private
     */
    private divide(division: Division, orientation: Orientation): boolean {
        if (orientation === 'horizontal') {
            if (division.xEnd - division.xStart <= 2) {
                return false;
            }

            const divideAtY = getRandomIntInclusive(
                division.yStart,
                division.yEnd - 1,
                this.yParity
            );
            for (let i = division.xStart; i < division.xEnd; i++) {
                this.paintNode(i, divideAtY, 1);
            }
            // create passage.
            const randomX =
                Math.floor(Math.random() * (division.xEnd - division.xStart)) + division.xStart;
            let passageFound = false;
            if (this.grid?.[division.xStart - 1]?.[divideAtY]?.status === 9) {
                this.paintNode(division.xStart, divideAtY, 9);
                passageFound = true;
            }
            if (this.grid?.[division.xEnd]?.[divideAtY]?.status === 9) {
                this.paintNode(division.xEnd - 1, divideAtY, 9);

                passageFound = true;
            }
            if (!passageFound) {
                this.paintNode(randomX, divideAtY, 9);
            }
            // Calculate subdivisions.
            const upperDivision: Division = {
                xStart: division.xStart,
                xEnd: division.xEnd,
                yStart: division.yStart,
                yEnd: divideAtY
            };
            const lowerDivision: Division = {
                xStart: division.xStart,
                xEnd: division.xEnd,
                yStart: divideAtY + 1,
                yEnd: division.yEnd
            };
            this.divisions.push(upperDivision, lowerDivision);
        } else {
            if (division.yEnd - division.yStart <= 2) {
                return false;
            }
            const divideAtX = getRandomIntInclusive(
                division.xStart,
                division.xEnd - 1,
                this.xParity
            );

            for (let i = division.yStart; i < division.yEnd; i++) {
                this.paintNode(divideAtX, i, 1);
            }
            // Create passage.
            const randomY =
                Math.floor(Math.random() * (division.yEnd - division.yStart)) + division.yStart;
            const passageFound = false;
            if (this.grid?.[divideAtX]?.[division.yStart - 1]?.status === 9) {
                this.paintNode(divideAtX, division.yStart, 9);
            }
            if (this.grid?.[divideAtX]?.[division.yEnd]?.status === 9) {
                this.paintNode(divideAtX, division.yEnd - 1, 9);
            }
            if (!passageFound) {
                this.paintNode(divideAtX, randomY, 9);
            }

            // Calculate subdivisions.
            const leftDivision: Division = {
                xStart: division.xStart,
                xEnd: divideAtX,
                yStart: division.yStart,
                yEnd: division.yEnd
            };
            const rightDivision: Division = {
                xStart: divideAtX + 1,
                xEnd: division.xEnd,
                yStart: division.yStart,
                yEnd: division.yEnd
            };
            this.divisions.push(leftDivision, rightDivision);
        }

        return true;
    }

    public nextStep(): Node[][] | null {
        while (this.divisions.length > 0) {
            const division = this.divisions.pop();

            const orientation = this.chooseOrientation(
                division.xEnd - division.xStart,
                division.yEnd - division.yStart
            );

            // It returns false if the region was too small.
            if (this.divide(division, orientation)) {
                return this.grid;
            }
        }

        // No other divisions can be found.
        return null;
    }

    public setInitialData(grid: Node[][]): void {
        this.grid = grid;
        this.divisions = [
            {
                xStart: 0,
                xEnd: grid.length,
                yStart: 0,
                yEnd: this.grid[0].length
            }
        ];
        this.xParity = this.grid.length % 2 === 0 ? 'even' : 'odd';
        this.yParity = this.grid[0].length % 2 === 0 ? 'even' : 'odd';
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.divisions = deserializedState.divisions;
        this.xParity = deserializedState.xParity;
        this.yParity = deserializedState.yParity;
        this.statRecords = statRecords;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        this.updateState(newGrid, serializedState, statRecords);
    }

    public serialize(): object {
        return {
            divisions: this.divisions,
            xParity: this.xParity,
            yParity: this.yParity
        };
    }

    public getState(): object {
        return {
            divisions: this.divisions,
            xParity: this.xParity,
            yParity: this.yParity
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Recursive-Division';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
