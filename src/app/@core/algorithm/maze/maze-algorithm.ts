import {MazeAlgorithms, Node} from '../../../../types';

export interface MazeAlgorithm {

  /**
   * Return the complete algorithm directly
   *
   * @param currentGrid - the current grid that is displayed on the site
   */
  completeAlgorithm(currentGrid: Node[][]): Node[][];

  /**
   * Returns the new step / iteration based on the currentGrid
   *
   * @param currentGrid - the current grid that is displayed on the site
   */
  nextStep(currentGrid: Node[][]): Node[][];

  /**
   * Returns the name of the algorithm
   */
  getAlgorithmName(): MazeAlgorithms;

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string;
}
