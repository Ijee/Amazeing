import {
    Node,
    Statistic,
    MazeAlgorithm,
    Parity,
    Orientation
} from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { getRandomIntInclusive } from '../../../../@shared/utils/general-utils';

type Division = { xStart: number; xEnd: number; yStart: number; yEnd: number };

export class RecursiveDivision extends MazeAlgorithmAbstract {
    private divisions: [Division];
    // so we divide the "correct way" in an odd or even grid
    private xParity: Parity;
    private yParity: Parity;

    constructor() {
        super(
            [],
            [{ name: 'divisions', type: 'status-none', currentValue: 0 }],
            {
                controls: []
            },
            {}
        );
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

            let divideAtY = getRandomIntInclusive(division.yStart, division.yEnd - 1, this.yParity);
            console.log('divideAtY', divideAtY);
            for (let i = division.xStart; i < division.xEnd; i++) {
                this.currentGrid[i][divideAtY].status = 1;
            }
            // create passage
            let randomX =
                Math.floor(Math.random() * (division.xEnd - division.xStart)) + division.xStart;
            let passageFound = false;
            if (this.currentGrid?.[division.xStart - 1]?.[divideAtY]?.status === 9) {
                this.currentGrid[division.xStart][divideAtY].status = 9;
                passageFound = true;
            }
            if (this.currentGrid?.[division.xEnd]?.[divideAtY]?.status === 9) {
                this.currentGrid[division.xEnd - 1][divideAtY].status = 9;

                passageFound = true;
            }
            if (!passageFound) {
                this.currentGrid[randomX][divideAtY].status = 9;
            }
            // calculate subdivisions
            let upperDivision: Division = {
                xStart: division.xStart,
                xEnd: division.xEnd,
                yStart: division.yStart,
                yEnd: divideAtY
            };
            let lowerDivision: Division = {
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
            let divideAtX = getRandomIntInclusive(division.xStart, division.xEnd - 1, this.yParity);
            console.log('divideAtX', divideAtX);

            for (let i = division.yStart; i < division.yEnd; i++) {
                this.currentGrid[divideAtX][i].status = 1;
            }
            // create passage
            let randomY =
                Math.floor(Math.random() * (division.yEnd - division.yStart)) + division.yStart;
            let passageFound = false;
            if (this.currentGrid?.[divideAtX]?.[division.yStart - 1]?.status === 9) {
                this.currentGrid[divideAtX][division.yStart].status = 9;
                console.log('Vertical anfang yStart:', division.yStart, 'yEnd:', division.yEnd);

                let passageFound = true;
            }
            if (this.currentGrid?.[divideAtX]?.[division.yEnd]?.status === 9) {
                this.currentGrid[divideAtX][division.yEnd - 1].status = 9;
                // TODO this and xEnd check above broken I guess
                console.log('Vertical ende yStart:', division.yStart, 'yEnd:', division.yEnd);
                let passageFound = true;
            }
            if (!passageFound) {
                this.currentGrid[divideAtX][randomY].status = 9;
            }

            // calculate subdivisions
            let leftDivision: Division = {
                xStart: division.xStart,
                xEnd: divideAtX,
                yStart: division.yStart,
                yEnd: division.yEnd
            };
            let rightDivision: Division = {
                xStart: divideAtX + 1,
                xEnd: division.xEnd,
                yStart: division.yStart,
                yEnd: division.yEnd
            };
            this.divisions.push(leftDivision, rightDivision);
        }

        this.statRecords[0].currentValue += 1;
        return true;
    }

    public nextStep(): Node[][] {
        if (this.divisions.length > 0) {
            let viableDivision = false;
            while (!viableDivision) {
                let division = this.divisions[this.divisions.length - 1];
                this.divisions.pop();
                let orientation = this.chooseOrientation(
                    division.xEnd - division.xStart,
                    division.yEnd - division.yStart
                );
                viableDivision = this.divide(division, orientation);
            }
        } else {
            return null;
        }
        return this.currentGrid;
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;
        this.divisions = [
            {
                xStart: 0,
                xEnd: currentGrid.length,
                yStart: 0,
                yEnd: this.currentGrid[0].length
            }
        ];
        this.xParity = this.currentGrid.length % 2 === 0 ? 'even' : 'odd';
        this.yParity = this.currentGrid[0].length % 2 === 0 ? 'even' : 'odd';
    }

    public updateAlgorithmState(
        newGrid: Node[][],
        deserializedState: any,
        statRecords: Statistic[]
    ): void {
        this.currentGrid = newGrid;
        deserializedState.divisions = this.divisions;
        deserializedState.xParity = this.xParity;
        deserializedState.yParity = this.yParity;
        statRecords = this.statRecords;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        this.updateAlgorithmState(newGrid, serializedState, statRecords);
    }

    public getSerializedState(): Object {
        return {
            divisions: this.divisions,
            xParity: this.xParity,
            yParity: this.yParity
        };
    }

    public getCurrentAlgorithmState(): Object {
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
