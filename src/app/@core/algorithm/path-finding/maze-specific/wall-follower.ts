import {
    Direction,
    Node,
    PathFindingAlgorithm,
    Statistic
} from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { PathFindingAlgorithmAbstract } from '../path-finding-algorithm.abstract';
import { faL } from '@fortawesome/free-solid-svg-icons';

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
    }

    public nextStep(): Node[][] {
        // check if the goal is in reach
        let neighbours = this.getNeighbours(this.cursor, 2);
        for (let i = 0; i < neighbours.length; i++) {
            let node = neighbours[i];
            if (node.status === 3) {
                return null;
            }
        }

        return this.currentGrid;
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;
        this.cursor = currentStartPoint;
        this.direction = 'right';
    }

    public updateAlgorithmState(
        newGrid: Node[][],
        deserializedState: any,
        statRecords: Statistic[]
    ): void {
        throw new Error('Method not implemented.');
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
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
        return false;
    }

    public usesHeuristics(): boolean {
        return false;
    }
}
