import {PathFindingAlgorithmInterface} from './path-finding-algorithm.interface';
import {PathFindingAlgorithms, Node, PathFindingHeuristics} from '../../../../types';

export class AStar implements PathFindingAlgorithmInterface {
  isAlgorithmActive: boolean;

  constructor() {
    this.isAlgorithmActive = false;
  }


  public completeAlgorithm(currentGrid: Node[][], currentHeuristic: PathFindingHeuristics): Node[][] {
    return currentGrid;
  }

  public nextStep(currentGrid: Node[][], currentHeuristic: PathFindingHeuristics): Node[][] {
    return currentGrid;
  }

  public getAlgorithmName(): PathFindingAlgorithms {
    return 'A-Star';
  }

  getUpdatedStats(): string {
    return 'drölf';
  }

  getIsAlgorithmActive(): boolean {
    return this.isAlgorithmActive;
  }

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string {
    return 'a-star';
  }
}
