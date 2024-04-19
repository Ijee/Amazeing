import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';
import { GridLocation } from '../../../@shared/classes/GridLocation';
import { Node, PathFindingAlgorithm, Statistic } from '../../types/algorithm.types';

export class Dijkstra extends PathFindingAlgorithmAbstract {
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
        return this.currentGrid;
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        throw new Error('Method not implemented.');
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        throw new Error('Method not implemented.');
    }

    public serialize(): Object {
        throw new Error('Method not implemented.');
    }

    public getState(): Object {
        throw new Error('Method not implemented.');
    }

    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Dijkstra';
    }

    public usesNodeWeights(): boolean {
        return true;
    }

    public usesHeuristics(): boolean {
        return true;
    }
}
