import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';
import { GridLocation } from '../../../@shared/classes/GridLocation';
import {
    Node,
    PathFindingAlgorithm,
    PathFindingHeuristic,
    StatRecord
} from '../../types/algorithm.types';

export class Dijkstra extends PathFindingAlgorithmAbstract {
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
        return this.currentGrid;
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;
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
        return 'Dijkstra';
    }

    public usesNodeWeights(): boolean {
        return true;
    }
}
