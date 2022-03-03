import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { Node, StatRecord, MazeAlgorithm } from 'src/types';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';

/**
 * This is the implementation of Wilsons algorithm tailored for creating a maze.
 */

type visit = {
    gridLocation: GridLocation;
    direction: string;
};

export class Wilsons extends MazeAlgorithmAbstract {
    private gridWith: number;
    private gridHeight: number;
    private cursor: GridLocation;
    private remainingNodes: number;
    private visits: visit[];
    private isWalking: boolean;

    constructor() {
        super(
            [],
            [
                {
                    name: 'Cursor',
                    type: 'status-4'
                },
                {
                    name: 'Remaining Nodes',
                    type: 'status-none',
                    currentValue: 0
                },
                {
                    name: 'Nodes Found',
                    type: 'status-5',
                    currentValue: 0
                }
            ],
            {
                controls: [
                    {
                        name: 'Node Choice',
                        label: 'Node Choice',
                        value: 'choose random node',
                        values: [
                            'choose random node',
                            'sequential node selection'
                        ],
                        type: 'radio',
                        validators: {
                            required: true
                        }
                    }
                ]
            },
            {}
        );
        this.isWalking = false;
    }

    public nextStep(): Node[][] | null {
        console.log(this.options);
        throw new Error('Method not implemented.');
    }

    public setInitialData(
        currentGrid: Node[][],
        currentStartPoint: GridLocation
    ): void {
        this.currentGrid = currentGrid;
        this.gridWith = this.currentGrid.length;
        this.gridHeight = this.currentGrid[0].length;

        this.remainingNodes = this.gridWith * this.gridHeight - 2;
        this.statRecords[1].currentValue = this.remainingNodes;

        this.cursor = currentStartPoint;
        const statusChange = this.buildWalls(currentStartPoint, 0);
        this.statRecords[1].currentValue -= statusChange.status0;
        this.remainingNodes -= statusChange.status0;
    }

    public updateAlgorithmState(
        newGrid: Node[][],
        deserializedState: any,
        statRecords: StatRecord[]
    ): void {
        throw new Error('Method not implemented.');
    }

    public deserialize(
        newGrid: Node[][],
        serializedState: any,
        statRecords: StatRecord[]
    ): void {
        const cursor = serializedState.cursor;
        const deserializedState = {
            cursor: new GridLocation(cursor.x, cursor.y, cursor.weight),
            remainingNodes: serializedState.remainingNodes,
            visits: serializedState.visits,
            isWalking: serializedState.isWalking
        };
        this.updateAlgorithmState(newGrid, deserializedState, statRecords);
    }

    public getSerializedState(): Object {
        return {
            cursor: this.cursor.toObject(),
            remainingNodes: this.remainingNodes,
            visits: this.visits,
            isWalking: this.isWalking
        };
    }

    public getCurrentAlgorithmState(): Object {
        return {
            cursor: this.cursor,
            remainingNodes: this.remainingNodes,
            visits: this.visits,
            isWalking: this.isWalking
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Wilsons';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
