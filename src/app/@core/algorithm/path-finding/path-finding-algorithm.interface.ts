import {AlgoStatNames, Node, PathFindingAlgorithms, PathFindingHeuristics} from '../../../../types';
import {GridLocation} from '../../../@shared/GridLocation';

export interface PathFindingAlgorithmInterface {
  currentGrid: Node[][];
  algoStatNames: AlgoStatNames;

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
  setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation, currentHeuristic: PathFindingHeuristics): void;

  /**
   * Returns the name of the algorithm
   */
  getAlgorithmName(): PathFindingAlgorithms;

  /**
   * Returns an object that determines what the stat is supposed to represent
   */
  getAlgorithmStatNames(): AlgoStatNames;

  /**
   * Returns the added stats for each step
   */
  getUpdatedStats(): string;


  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string;
}
