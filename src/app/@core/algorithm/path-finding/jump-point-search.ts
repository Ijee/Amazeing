import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { Node, Statistic, PathFindingAlgorithm } from '../../types/algorithm.types';
import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';

export class JumpPointSearch extends PathFindingAlgorithmAbstract {
    constructor() {
        super(
            [],
            [
                {
                    name: 'TODO',
                    type: 'status-4'
                }
            ],
            {
                controls: []
            }
        );
    }
    public nextStep(): Node[][] {
        return this.grid;
    }
    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
    }
    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
    }
    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        throw new Error('Method not implemented.');
    }
    public serialize(): Object {
        throw new Error('Method not implemented.');
    }
    public getState(): Object {
        return {};
    }
    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Jump-PS';
    }
    public usesNodeWeights(): boolean {
        return false;
    }
    public usesHeuristics(): boolean {
        return true;
    }
    public usesPathFindingSettings(): boolean {
        return true;
    }
    public forcesDiagonalMovement(): boolean {
        return true;
    }
}
