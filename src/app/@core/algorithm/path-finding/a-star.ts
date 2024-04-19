import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';
import { GridLocation } from '../../../@shared/classes/GridLocation';
import { Node, PathFindingAlgorithm, Statistic } from '../../types/algorithm.types';
import { JsonFormData } from '../../types/jsonform.types';

export class AStar extends PathFindingAlgorithmAbstract {
    constructor() {
        super(
            [],
            [],
            {
                controls: []
            },
            {},
            'None'
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
        return 'A-Star';
    }

    public getStatRecords(): Statistic[] {
        throw new Error('Method not implemented.');
    }

    public getJsonFormData(): JsonFormData {
        throw new Error('Method not implemented.');
    }

    public usesNodeWeights(): boolean {
        throw new Error('Method not implemented.');
    }

    public usesHeuristics(): boolean {
        return true;
    }
}
