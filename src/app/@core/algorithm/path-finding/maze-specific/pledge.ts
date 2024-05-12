import { GridLocation } from '../../../../@shared/classes/GridLocation';
import {
    Node,
    PathFindingHeuristic,
    Statistic,
    PathFindingAlgorithm,
    Direction
} from '../../../types/algorithm.types';
import { PathFindingAlgorithmAbstract } from '../path-finding-algorithm.abstract';
interface TurnResult {
    leftTurn: boolean;
    rightTurn: boolean;
}

export class Pledge extends PathFindingAlgorithmAbstract {
    private cursor: GridLocation;
    private direction: Direction;
    private angle: number;
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
                },
                {
                    name: 'Angle',
                    type: 'status-none',
                    currentValue: 0
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
            }
        );
        this.direction = 'right';
        this.angle = 0;
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
    private newDirection(order?: Direction[]): Direction {
        // let currentDirectionIndex = order.indexOf(this.direction);
        for (let i = 0; i < order.length; i++) {
            const direction = order[i];
            // const direction = order[(currentDirectionIndex + i) % order.length];

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
            x >= this.grid.length ||
            y >= this.grid[0].length ||
            this.grid[x][y].status === 1
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

    private determineTurn(oldDirection: Direction, newDirection: Direction): TurnResult {
        let leftTurn = false;
        let rightTurn = false;

        switch (oldDirection) {
            case 'up':
                leftTurn = newDirection === 'left';
                rightTurn = newDirection === 'right';
                break;
            case 'down':
                leftTurn = newDirection === 'right';
                rightTurn = newDirection === 'left';
                break;
            case 'left':
                leftTurn = newDirection === 'down';
                rightTurn = newDirection === 'up';
                break;
            case 'right':
                leftTurn = newDirection === 'up';
                rightTurn = newDirection === 'down';
                break;
            default:
                throw new Error('Invalid direction');
        }

        return { leftTurn, rightTurn };
    }

    public nextStep(): Node[][] {
        // let neighbours = this.getNeighbours(this.cursor, 1);
        // let hasNeighbourWalls = neighbours.some((neighbour) => {
        //     return neighbour.status === 1;
        // });

        const forwardIsValid = this.newDirection([this.direction]) === this.direction;

        const order = this.determineOrder();

        const newDirection = this.newDirection(order);

        // check if the new cursor is the goal
        if (this.grid[this.cursor.x][this.cursor.y].status === 3) {
            return null;
        } else if (this.angle === 0 && forwardIsValid) {
            this.moveCursor();
            return this.grid;
        } else {
            const turnResult = this.determineTurn(this.direction, newDirection);
            if (turnResult.leftTurn) {
                this.angle += -90;
                this.statRecords[2].currentValue = this.angle;
            } else if (turnResult.rightTurn) {
                this.angle += 90;
                this.statRecords[2].currentValue = this.angle;
            }

            // this.paintNode(this.cursor.x, this.cursor.y, 8);

            this.direction = this.newDirection(order);
            this.moveCursor();

            return this.grid;
        }
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        this.cursor = startLocation;
    }
    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
        this.cursor = deserializedState.cursor;
        this.direction = deserializedState.direction;
        this.angle = deserializedState.angle;
    }
    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const cursor = serializedState.cursor;
        const deserializedState = {
            cursor: new GridLocation(cursor.x, cursor.y, cursor.weight, cursor.status),
            direction: serializedState.direction,
            angle: serializedState.angle
        };

        this.updateState(newGrid, deserializedState, statRecords);
    }
    public serialize(): Object {
        return {
            cursor: this.cursor.toObject(),
            direction: this.direction,
            angle: this.angle
        };
    }
    public getState(): Object {
        return {
            cursor: this.cursor,
            direction: this.direction,
            angle: this.angle
        };
    }
    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Pledge';
    }
    public usesNodeWeights(): boolean {
        return false;
    }
    public usesHeuristics(): boolean {
        return false;
    }
}
