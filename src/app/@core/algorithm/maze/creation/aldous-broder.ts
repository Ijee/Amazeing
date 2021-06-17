import {MazeAlgorithmAbstract} from '../maze-algorithm.abstract';
import {MazeAlgorithm, Node, StatRecord} from '../../../../../types';
import {GridLocation} from '../../../../@shared/classes/GridLocation';


/**
 * This is the implementation of the Aldous-Broder algorithm tailored for creating
 * a maze.
 */
export class AldousBroder extends MazeAlgorithmAbstract {
  private gridWith: number;
  private gridHeight: number;
  private remainingNodes: number;
  private cursor: GridLocation;

  constructor() {
    super([], [
      {
        name: 'Discovered Nodes',
        type: 'status-4',
        currentValue: 0
      }
    ]);
  }


  private buildWalls(loc: GridLocation): void {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const xAxis = loc.x + i;
        const yAxis = loc.y + j;
        if (xAxis >= 0 && yAxis >= 0 && xAxis < this.currentGrid.length && yAxis < this.currentGrid[0].length) {
          const status = this.currentGrid[xAxis][yAxis].status;
          if (status === -1) {
            this.currentGrid[xAxis][yAxis].status = 0;
          }
        }
      }
    }
  }

  private buildWayBetween(loc1: GridLocation, loc2: GridLocation): void {
    console.log('loc1', loc1);
    console.log('loc2', loc2);
    const x = (loc1.x + loc2.x) / 2;
    const y = (loc1.y + loc2.y) / 2;
    const node = this.currentGrid[x][y];
    if (node.status === 0) {
      node.status = 4;
    }
  }

  nextStep(): Node[][] | null {
    if (this.remainingNodes > 0) {
      const neighbours = this.neighbours(this.cursor);
      console.log(neighbours);
      const randomNeighbour = Math.floor(Math.random() * neighbours.length);
      console.log('randomNeighbour', randomNeighbour);
      if (neighbours.length === 0) {
        this.buildWayBetween(this.cursor,
          neighbours[randomNeighbour]);
        this.cursor = neighbours[randomNeighbour];
      } else {
        // move in random direction
        this.cursor = neighbours[randomNeighbour];
      }
      return this.currentGrid;
    } else {
      return null;
    }
  }

  setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
    this.currentGrid = currentGrid;
    this.gridWith = this.currentGrid.length;
    this.gridHeight = this.currentGrid[0].length;
    this.remainingNodes = this.gridWith * this.gridHeight;

    this.cursor = currentStartPoint;
    console.log('cursor in setInitialData', this.cursor, currentStartPoint);
    this.buildWalls(currentStartPoint);
  }

  updateAlgorithmState(newGrid: Node[][], algorithmState: any, statRecords: StatRecord[]): void {
    this.currentGrid = newGrid;
    this.statRecords = statRecords;
    this.cursor = algorithmState.cursor;
  }

  deserialize(newGrid: Node[][], serializedState: any, statRecords: StatRecord[]): void {
    const cursor = serializedState.cursor;
    const deserializedState = {
      cursor: new GridLocation(cursor.x, cursor.y, cursor.weight)
    };
    this.updateAlgorithmState(newGrid, deserializedState, statRecords);
  }

  getSerializedState(): any {
    return {
      cursor: this.cursor.toObject()
    };
  }

  getAlgorithmName(): MazeAlgorithm {
    return 'Aldous-Broder';
  }

  getStatRecords(): StatRecord[] {
    return this.statRecords;
  }

  getCurrentAlgorithmState(): any {
    return {
      cursor: this.cursor
    };
  }

  usesNodeWeights(): boolean {
    return false;
  }

}
