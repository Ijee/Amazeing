import {AlgoStatNames, MazeAlgorithm, Node, StatRecord} from '../../../../types';
import {GridLocation} from '../../../@shared/Classes/GridLocation';

export interface MazeAlgorithmInterface {
  currentGrid: Node[][];
  algoStats: StatRecord;
  algoStatNames: AlgoStatNames;

  /**
   * Returns the new step / iteration based on the currentGrid
   */
  nextStep(): Node[][] | null;

  /**
   * Sets the starting point for the algorithm to the one
   * the user set on the grid
   *
   * @param currentGrid - the current grid from the simulation service
   * @param currentStartPoint - the starting point for the algorithm
   */
  setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void;

  /**
   * Updates the algorithm state that needs to be done when
   * either a backwards step has been set or the client
   * tried to import from a string through the ui.
   *
   * Refer to how to load the state back in on what is being returned
   * in getCurrentAlgorithmState
   *
   * @param algorithmState - the new algorithm state
   * @param algorithmStats - the new algorithm stats
   * @param currentGrid - the current Grid
   */

  updateAlgorithmState(currentGrid: Node[][], algorithmState: any, algorithmStats: StatRecord): void;

  /**
   * This function is responsible for deserializing the internal state of the algorithm and
   * then updating it by calling updateAlgorithmState with it.
   *
   * It is being called when the user tries to import a custom session into the app.
   *
   * @param newGrid - the current Grid
   * @param serializedState - the serialized data
   * @param algorithmStats - the new algorithm stats
   */
  deserialize(newGrid: Node[][], serializedState: any, algorithmStats: StatRecord): void;

  /**
   * This function serializes the internal state of the algorithm and then returns it as an object.
   * This has to be done in order to make the state exportable as a JSON string.
   *
   * Remember that classes can not be serialized with JSON.stringify as they most often include functions.
   */
  getSerializedState(): any;


  /**
   * Returns the name of the algorithm
   */
  getAlgorithmName(): MazeAlgorithm;

  /**
   * Returns an object that determines what the stat is supposed to represent
   */
  getAlgorithmStatNames(): AlgoStatNames;

  /**
   * Returns the added stats for each step
   */
  getAlgorithmStats(): StatRecord;

  /**
   * Returns the current algorithm state that should at least
   * be an object.
   */
  getCurrentAlgorithmState(): any;

  /**
   * Returns whether or not the current algorithm uses node weights.
   */
  usesNodeWeights(): boolean;
}
