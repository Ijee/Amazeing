import {PathFindingAlgorithm} from './path-finding-algorithm';
import {PathFindingAlgorithms, Node, PathFindingHeuristics} from '../../../../types';

export class Dijkstra implements PathFindingAlgorithm {

  public completeAlgorithm(currentGrid: Node[][], currentHeuristic: PathFindingHeuristics): Node[][] {
    return currentGrid;
  }

  public nextStep(currentGrid: Node[][], currentHeuristic: PathFindingHeuristics): Node[][] {
    return currentGrid;
  }

  public getAlgorithmName(): PathFindingAlgorithms {
    return 'Dijkstra';
  }

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string {
    return 'dijkstra';
  }
}
