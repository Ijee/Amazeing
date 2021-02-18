import {Node, PathFindingAlgorithms, PathFindingHeuristics} from '../../../../types';

export interface PathFindingAlgorithm {

  /**
   * Return the complete algorithm directly
   *
   * @param currentGrid - the current grid that is displayed on the site
   * @param currentHeuristic - the current heuristic that is set
   */
  completeAlgorithm(currentGrid: Node[][], currentHeuristic: PathFindingHeuristics): Node[][];

  /**
   * Returns the new step / iteration based on the currentGrid
   *
   * @param currentGrid - the current grid that is displayed on the site
   */
  nextStep(currentGrid: Node[][], currentHeuristic: PathFindingHeuristics): Node[][];

  /**
   * Returns the name of the algorithm
   */
  getAlgorithmName(): PathFindingAlgorithms;

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string;
}
