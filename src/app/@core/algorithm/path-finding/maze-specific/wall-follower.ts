import { Node, StatRecord, PathFindingAlgorithm } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { PathFindingAlgorithmAbstract } from '../path-finding-algorithm.abstract';

export class WallFollower extends PathFindingAlgorithmAbstract {
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
                    name: 'Already visited',
                    type: 'status-7'
                },
                {
                    name: 'Walking Distance',
                    type: 'status-none',
                    currentValue: 0
                }
            ],
            {
                controls: [
                    {
                        name: 'Choose Side',
                        label: 'Choose Side',
                        value: 'Follow Left Side',
                        values: ['Follow Left Side', 'Follow Right Side'],
                        type: 'radio',
                        validators: {
                            required: true
                        }
                    }
                ]
            },
            {}
        );
    }
    public nextStep(): Node[][] {
        return this.currentGrid;
    }
    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;
        const gridWith = this.currentGrid.length;
        const gridHeight = this.currentGrid[0].length;
        for (let i = 0; i < gridWith; i++) {
            for (let j = 0; j < gridHeight; j++) {
                this.currentGrid[i][j].weight = 7;
            }
        }
    }
    public updateAlgorithmState(
        newGrid: Node[][],
        deserializedState: any,
        statRecords: StatRecord[]
    ): void {
        throw new Error('Method not implemented.');
    }
    public deserialize(newGrid: Node[][], serializedState: any, statRecords: StatRecord[]): void {
        throw new Error('Method not implemented.');
    }
    public getSerializedState(): Object {
        throw new Error('Method not implemented.');
    }
    public getCurrentAlgorithmState(): Object {
        throw new Error('Method not implemented.');
    }
    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Wall-Follower';
    }
    public usesNodeWeights(): boolean {
        return true;
    }
}
