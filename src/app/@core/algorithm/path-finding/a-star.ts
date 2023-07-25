import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';
import {
    PathFindingAlgorithm,
    Node,
    PathFindingHeuristic,
    JsonFormData,
    StatRecord
} from '../../../../types';
import { GridLocation } from '../../../@shared/classes/GridLocation';

export class AStar extends PathFindingAlgorithmAbstract {
    constructor() {
        super(
            [],
            [],
            {
                controls: []
            },
            {}
        );
    }

    public nextStep(): Node[][] {
        throw new Error('Method not implemented.');
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        throw new Error('Method not implemented.');
    }

    public setOptions(options: Object): void {
        throw new Error('Method not implemented.');
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
        return 'A-Star';
    }

    public getStatRecords(): StatRecord[] {
        throw new Error('Method not implemented.');
    }

    public getJsonFormData(): JsonFormData {
        throw new Error('Method not implemented.');
    }

    public usesNodeWeights(): boolean {
        throw new Error('Method not implemented.');
    }
}
