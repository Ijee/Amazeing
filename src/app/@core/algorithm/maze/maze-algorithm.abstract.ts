import {MazeAlgorithm, Node, StatRecord} from '../../../../types';
import {GridLocation} from '../../../@shared/classes/GridLocation';

export abstract class MazeAlgorithmAbstract {


  protected constructor(
    protected currentGrid: Node[][],
    protected statRecords: StatRecord[]
  ) {}

  protected neighbours(loc: GridLocation): GridLocation[] {
    const res: GridLocation[] = [];
    if (loc.y < this.currentGrid[0].length - 2) {
      const node = this.currentGrid[loc.x][loc.y + 2];
      const status = node.status;
      if (status === 2 || status === 3 || status === 5) {
        res.push(new GridLocation(loc.x, loc.y + 2, node.weight));
      }
    }
    if (loc.x < this.currentGrid.length - 2) {
      const node = this.currentGrid[loc.x + 2][loc.y];
      const status = node.status;
      if (status === 2 || status === 3 || status === 5) {
        res.push(new GridLocation(loc.x + 2, loc.y, node.weight));
      }
    }
    if (loc.y >= 2) {
      const node = this.currentGrid[loc.x][loc.y - 2];
      const status = node.status;
      if (status === 2 || status === 3 || status === 5) {
        res.push(new GridLocation(loc.x, loc.y - 2, node.weight));
      }
    }
    if (loc.x >= 2) {
      const node = this.currentGrid[loc.x - 2][loc.y];
      const status = node.status;
      if (status === 2 || status === 3 || status === 5) {
        res.push(new GridLocation(loc.x - 2, loc.y, node.weight));
      }
    }
    return res;
  }

  /**
   * Returns the new step / iteration based on the currentGrid
   */
  public abstract nextStep(): Node[][] | null;

  /**
   * Sets the starting point for the algorithm to the one
   * the user set on the grid
   *
   * @param currentGrid - the current grid from the simulation service
   * @param currentStartPoint - the starting point for the algorithm
   */
  abstract setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void;

  /**
   * Updates the algorithm state that needs to be done when
   * either a backwards step has been set or the client
   * tried to import from a string through the ui.
   *
   * Refer to how to load the state back in on what is being returned
   * in getCurrentAlgorithmState
   *
   * @param algorithmState - the new algorithm state
   * @param statRecords - the new algorithm statRecords
   * @param newGrid - the current Grid
   */

  abstract updateAlgorithmState(newGrid: Node[][], algorithmState: any, statRecords: StatRecord[]): void;

  /**
   * This function is responsible for deserializing the internal state of the algorithm and
   * then updating it by calling updateAlgorithmState with it.
   *
   * It is being called when the user tries to import a custom session into the app.
   *
   * @param newGrid - the current Grid
   * @param serializedState - the serialized data
   * @param statRecords - the new algorithm stats
   */
  abstract deserialize(newGrid: Node[][], serializedState: any, statRecords: StatRecord[]): void;

  /**
   * This function serializes the internal state of the algorithm and then returns it as an object.
   * This has to be done in order to make the state exportable as a JSON string.
   *
   * Remember that classes can not be serialized with JSON.stringify as they most often include functions.
   */
  public abstract getSerializedState(): any;


  /**
   * Returns the name of the algorithm.
   */
  public abstract getAlgorithmName(): MazeAlgorithm;

  /**
   * Returns the stat records for the algorithm,.
   */
  public abstract getStatRecords(): StatRecord[];

  /**
   * Returns the current algorithm state that should at least
   * be an object.
   */
  public abstract getCurrentAlgorithmState(): any;

  /**
   * Returns whether or not the current algorithm uses node weights.
   */
  public abstract usesNodeWeights(): boolean;

}
