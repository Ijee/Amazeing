import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';
import {
    PathFindingAlgorithm,
    Node,
    PathFindingHeuristic,
    StatRecord
} from '../../../../types';
import { GridLocation } from '../../../@shared/classes/GridLocation';

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

    public setInitialData(
        currentGrid: Node[][],
        currentStartPoint: GridLocation
    ): void {
        this.currentGrid = currentGrid;
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
        throw new Error('Method not implemented.');
    }

    public getSerializedState() {
        throw new Error('Method not implemented.');
    }

    public getCurrentAlgorithmState() {
        throw new Error('Method not implemented.');
    }

    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Dijkstra';
    }

    public usesNodeWeights(): boolean {
        return true;
    }
}
