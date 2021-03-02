import {MazeAlgorithms, Node} from '../../../../types';
import {GridLocation} from '../../../@shared/GridLocation';

export interface MazeAlgorithmInterface {
  currentGrid: Node[][];
  isAlgorithmActive: boolean;

  /**
   * Return the complete algorithm directly
   *
   * @param currentGrid - the current grid that is displayed on the site
   */
  completeAlgorithm(currentGrid: Node[][]): Node[][];

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
   */
  setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void;


  /**
   * Returns the name of the algorithm
   */
  getAlgorithmName(): MazeAlgorithms;

  /**
   * Returns the added stats for each step
   */
  getUpdatedStats(): string;


  /**
   * Returns whether or not the algorithm is currently active.
   * This is different from SimulationService - isSimulationActive
   */
  getIsAlgorithmActive(): boolean;

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string;
}
