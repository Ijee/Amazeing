import {Node, PathFindingAlgorithm, PathFindingHeuristic} from '../../../../types';
import {GridLocation} from '../../../@shared/Classes/GridLocation';

export interface PathFindingAlgorithmInterface {
  currentGrid: Node[][];

  /**
   * Returns the new step / iteration based on the currentGrid
   */
  nextStep(): Node[][];

  /**
   * Sets the starting point for the algorithm to the one
   * the user set on the grid
   *
   * @param currentGrid - the current grid from the simulation service
   * @param currentStartPoint - the starting point for the algorithm
   * @param currentHeuristic - what heuristic should be used for the algorithm
   */
  setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation, currentHeuristic: PathFindingHeuristic): void;

  /**
   * Returns the name of the algorithm
   */
  getAlgorithmName(): PathFindingAlgorithm;

  /**
   * Returns the added stats for each step
   */
  getUpdatedStats(): string;


  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string;
}
