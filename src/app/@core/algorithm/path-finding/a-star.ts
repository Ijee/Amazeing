import {PathFindingAlgorithmInterface} from './path-finding-algorithm.interface';
import {PathFindingAlgorithm, Node, PathFindingHeuristic} from '../../../../types';
import {GridLocation} from '../../../@shared/classes/GridLocation';

export class AStar implements PathFindingAlgorithmInterface {
  currentGrid: Node[][];

  constructor() {

  }

  public nextStep(): Node[][] {
    return this.currentGrid;
  }

  public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation, currentHeuristic: PathFindingHeuristic): void {
    return null;
  }

  public getAlgorithmName(): PathFindingAlgorithm {
    return 'A-Star';
  }

  getUpdatedStats(): string {
    return 'drölf';
  }

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string {
    return 'a-star';
  }
}
