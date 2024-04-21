import {
    Direction,
    Node,
    PathFindingAlgorithm,
    Statistic
} from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { PathFindingAlgorithmAbstract } from '../path-finding-algorithm.abstract';
import { Direct } from 'protractor/built/driverProviders';

export class WallFollower extends PathFindingAlgorithmAbstract {
    private cursor: GridLocation;
    private direction: Direction;
    constructor() {
        super(
            [],
            [
                {
                    name: 'Cursor',
                    type: 'status-8'
                },
                {
                    name: 'Path taken',
                    type: 'status-4'
                }
            ],
            {
                controls: [
                    {
                        name: 'Rule',
                        label: 'Rule',
                        value: 'Right-Hand-Rule',
                        values: ['Right-Hand-Rule', 'Left-Hand-Rule'],
                        type: 'radio',
                        validators: {
                            required: true
                        }
                    }
                ]
            },
            {},
            'None'
        );
        this.direction = 'right';
    }

    /**
     * Determines what move order to use for the next step.
     *
     * @param direction determines the move order
     * @returns a new move order
     */
    private determineOrder(): Direction[] {
        let directions: Direction[];
        switch (this.direction) {
            case 'up':
                directions = ['right', 'up', 'left', 'down'];
                break;
            case 'right':
                directions = ['down', 'right', 'up', 'left'];
                break;
            case 'down':
                directions = ['left', 'down', 'right', 'up'];
                break;
            case 'left':
                directions = ['up', 'left', 'down', 'right'];
                break;
        }

        if (this.options.Rule === 'Left-Hand-Rule') {
            [directions[0], directions[2]] = [directions[2], directions[0]];
        }
        console.log('directions', directions);
        return directions;
    }

    /**
     * Determines the new direction for the cursor to move to
     * based on the order.
     *
     * @param order the order array
     * @returns the new direction to move to
     */
    private newDirection(order: Direction[]): Direction {
        let newDirection: Direction = 'down';
        for (let i = 0; i < order.length; i++) {
            const direction = order[i];
            if (direction === 'up' && this.isValid(this.cursor.x, this.cursor.y - 1)) {
                return 'up';
            } else if (direction === 'right' && this.isValid(this.cursor.x + 1, this.cursor.y)) {
                return 'right';
            } else if (direction === 'down' && this.isValid(this.cursor.x, this.cursor.y + 1)) {
                return 'down';
            } else if (direction === 'left' && this.isValid(this.cursor.x - 1, this.cursor.y)) {
                return 'left';
            }
        }
    }

    /**
     * Determines whether the location is valid for the
     * cursor to move to.
     *
     * @param x the x coordinate
     * @param y the y coordinate
     * @returns the locations validity
     */
    private isValid(x: number, y: number): boolean {
        if (
            x < 0 ||
            y < 0 ||
            x >= this.currentGrid.length ||
            y >= this.currentGrid[0].length ||
            this.currentGrid[x][y].status === 1
        ) {
            console.log('isValid: false');
            return false;
        } else {
            return true;
        }
    }

    private moveCursor(): void {
        this.paintNode(this.cursor.x, this.cursor.y, 8);
        switch (this.direction) {
            case 'up':
                this.cursor = new GridLocation(this.cursor.x, this.cursor.y - 1);
                break;
            case 'right':
                this.cursor = new GridLocation(this.cursor.x + 1, this.cursor.y);
                break;
            case 'down':
                this.cursor = new GridLocation(this.cursor.x, this.cursor.y + 1);
                break;
            case 'left':
                this.cursor = new GridLocation(this.cursor.x - 1, this.cursor.y);
                break;
        }
        this.paintNode(this.cursor.x, this.cursor.y, 7);
    }

    public nextStep(): Node[][] {
        // check if the new cursor is the goal
        if (this.currentGrid[this.cursor.x][this.cursor.y].status === 3) {
            return null;
        }

        const order = this.determineOrder();

        this.paintNode(this.cursor.x, this.cursor.y, 8);

        this.direction = this.newDirection(order);
        this.moveCursor();

        return this.currentGrid;
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;
        this.cursor = currentStartPoint;
        // as far as I know there is no standardized direction
        // so I just choose the algorithm to go 'right' at the start.
        const order = this.determineOrder();

        if (this.isValid(this.cursor.x + 1, this.cursor.y)) {
            this.direction = 'right';
        } else {
            this.direction = this.newDirection(order);
        }
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.currentGrid = newGrid;
        this.statRecords = statRecords;
        this.cursor = deserializedState.cursor;
        this.direction = deserializedState.direction;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const cursor = serializedState.cursor;
        const deserializedState = {
            cursor: new GridLocation(cursor.x, cursor.y),
            direction: serializedState.direction
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        return {
            cursor: this.cursor.toObject(),
            direction: this.direction
        };
    }

    public getState(): Object {
        return {
            cursor: this.cursor,
            direction: this.direction
        };
    }

    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Wall-Follower';
    }

    public usesNodeWeights(): boolean {
        return false;
    }

    public usesHeuristics(): boolean {
        return false;
    }
}
