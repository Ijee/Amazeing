import {PathFindingAlgorithm} from './path-finding-algorithm';
import {PathFindingAlgorithms, Node, PathFindingHeuristics} from '../../../../types';

export class AStar implements PathFindingAlgorithm {

  public completeAlgorithm(currentGrid: Node[][], currentHeuristic: PathFindingHeuristics): Node[][] {
    return currentGrid;
  }

  public nextStep(currentGrid: Node[][], currentHeuristic: PathFindingHeuristics): Node[][] {
    return currentGrid;
  }

  public getAlgorithmName(): PathFindingAlgorithms {
    return 'A-Star';
  }

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string {
    return 'a-star';
  }
}
