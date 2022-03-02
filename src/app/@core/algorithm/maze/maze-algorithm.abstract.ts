import {
  JsonFormData,
  MazeAlgorithm,
  Node,
  StatRecord,
  StatusChange
} from '../../../../types';
import {GridLocation} from '../../../@shared/classes/GridLocation';
import {FormGroup} from '@angular/forms';

export abstract class MazeAlgorithmAbstract {
  protected constructor(
    protected currentGrid: Node[][],
    protected statRecords: StatRecord[],
    protected jsonFormData: JsonFormData,
    protected options: Object
  ) {
  }

  /**
   * Builds a wall around the given GridLocation. This is the main method being used to build
   * the maze for each algorithm but does not have to be used for every algorithm of course.
   *
   * @param loc - the GridLocation to build the wall around with
   * @param overwritable - list of node statuses that may be overwritten by a wall
   * @protected
   */
  protected buildWalls(
    loc: GridLocation,
    ...overwritable: number[]
  ): StatusChange {
    const statusChange: StatusChange = {
      status0: 0,
      status1: 0,
      status4: 0,
      status5: 0,
      status6: 0,
      status7: 0,
      status8: 0,
      status9: 0
    };
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const xAxis = loc.x + i;
        const yAxis = loc.y + j;
        if (
          xAxis >= 0 &&
          yAxis >= 0 &&
          xAxis < this.currentGrid.length &&
          yAxis < this.currentGrid[0].length
        ) {
          const status = this.currentGrid[xAxis][yAxis].status;
          switch (status) {
            case 0:
              statusChange.status0++;
              break;
            case 1:
              // TODO does not detect status 1 changes - track with other variable
              // that starts at 9 and do -- each iteration if case 1 is found
              statusChange.status1++;
              break;
            case 4:
              statusChange.status4++;
              break;
            case 5:
              statusChange.status5++;
              break;
            case 6:
              statusChange.status6++;
              break;
            case 7:
              statusChange.status7++;
              break;
            case 8:
              statusChange.status8++;
              break;
            case 9:
              statusChange.status9++;
              break;
          }
          // Only overwrite the nodes that should disappear.
          if (overwritable.includes(status)) {
            this.currentGrid[xAxis][yAxis].status = 1;
          }
        }
      }
    }
    return statusChange;
  }

  /**
   * Builds a path between two GridLocations. Does not check for the locations to be
   * inside of the grid.
   *
   * Using two GridLocations that are not in a line will most likely look funny.
   *
   * @param loc1 - the loc1 GridLocation
   * @param loc2 - the loc2 GridLocation
   * @param nodeStatus - the node status for the node in between
   * @protected
   */
  protected buildPath(
    loc1: GridLocation,
    loc2: GridLocation,
    nodeStatus: number
  ): void {
    const x = (loc1.x + loc2.x) / 2;
    const y = (loc1.y + loc2.y) / 2;
    const node = this.currentGrid[x][y];
    if (node.status === 1) {
      node.status = nodeStatus;
    }
  }

  /**
   * Returns the neighbours for a given GridLocation.
   *
   * @param loc - the GridLocation to get the neighbours from
   * @param distance - the distance from the location where the neighbours should be located
   * @protected
   */
  protected getNeighbours(
    loc: GridLocation,
    distance: number
  ): GridLocation[] {
    const res: GridLocation[] = [];
    if (loc.y < this.currentGrid[0].length - distance) {
      const node = this.currentGrid[loc.x][loc.y + distance];
      res.push(new GridLocation(loc.x, loc.y + distance, node.weight));
    }
    if (loc.x < this.currentGrid.length - distance) {
      const node = this.currentGrid[loc.x + distance][loc.y];
      res.push(new GridLocation(loc.x + distance, loc.y, node.weight));
    }
    if (loc.y >= distance) {
      const node = this.currentGrid[loc.x][loc.y - distance];
      res.push(new GridLocation(loc.x, loc.y - distance, node.weight));
    }
    if (loc.x >= distance) {
      const node = this.currentGrid[loc.x - distance][loc.y];
      res.push(new GridLocation(loc.x - distance, loc.y, node.weight));
    }
    return res;
  }

  /**
   * Returns the new step / iteration based on the currentGrid.
   * Returns null when no further iteration can be done.
   */
  public abstract nextStep(): Node[][] | null;

  /**
   * Sets the starting point for the algorithm to the one
   * the user set on the grid
   *
   * @param currentGrid - the current grid from the simulation service
   * @param currentStartPoint - the starting point for the algorithm
   */
  public abstract setInitialData(
    currentGrid: Node[][],
    currentStartPoint: GridLocation
  ): void;

  /**
   * Sets the options for the algorithm.
   * The available values are based on what has been declared in jsonFormData.
   *
   * @param options
   */
  public setOptions(options: Object) {
    this.options = options;
  }

  /**
   * Updates the algorithm state that needs to be done when
   * either a backwards step has been set or the client
   * tried to import from a string through the ui.
   *
   * Refer to how to load the state back in on what is being returned
   * in getCurrentAlgorithmState
   *
   * @param deserializedState - the new algorithm state
   * @param statRecords - the new algorithm statRecords
   * @param newGrid - the current Grid
   */

  public abstract updateAlgorithmState(
    newGrid: Node[][],
    deserializedState: any,
    statRecords: StatRecord[]
  ): void;

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
  public abstract deserialize(
    newGrid: Node[][],
    serializedState: any,
    statRecords: StatRecord[]
  ): void;

  /**
   * This function serializes the internal state of the algorithm and then returns it as an object.
   * This has to be done in order to make the state exportable as a JSON string.
   *
   * Remember that classes can not be serialized with JSON.stringify as they most often include functions.
   */
  public abstract getSerializedState(): any;

  /**
   * Returns the current algorithm state that should at least
   * be an object.
   */
  public abstract getCurrentAlgorithmState(): any;

  /**
   * Returns the name of the algorithm.
   */
  public abstract getAlgorithmName(): MazeAlgorithm;

  /**
   * Returns the stat records for the algorithm,.
   */
  public getStatRecords(): StatRecord[] {
    return this.statRecords;
  }

  /**
   * Returns the algorithm options in a json format.
   * This is being used to create a form for the current algorithm so the user
   * can choose alternative algorithm implementations.
   */
  public getJsonFormData(): JsonFormData {
    return this.jsonFormData;
  }


  /**
   * Returns whether or not the current algorithm uses node weights.
   */
  public abstract usesNodeWeights(): boolean;
}
