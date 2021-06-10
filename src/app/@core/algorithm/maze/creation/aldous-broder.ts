import {MazeAlgorithmInterface} from '../maze-algorithm.interface';
import {MazeAlgorithm, Node, StatRecord} from '../../../../../types';
import {GridLocation} from '../../../../@shared/classes/GridLocation';


/**
 * This is the implementation of the Aldous-Broder algorithm tailored for creating
 * a maze.
 */
export class AldousBroder implements MazeAlgorithmInterface {
  currentGrid: Node[][];
  statRecords: StatRecord[];
  private gridWith: number;
  private gridHeight: number;
  private remainingNodes: number;
  private cursor: GridLocation;

  constructor() {
    this.statRecords = [
      {
        name: 'cursor-steps',
        type: 'status-5',
        currentValue: 0,
      },
      {
        name: 'cursor-steps',
        type: 'status-5',
        currentValue: 0,
      },
      {
        name: 'cursor-steps',
        type: 'status-5',
        currentValue: 0,
      },
      {
        name: 'cursor-steps',
        type: 'status-5',
        currentValue: 0,
      },
      {
        name: 'travelled to',
        type: 'status-4',
      }
    ];
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

  private neighbours(loc: GridLocation): GridLocation[] {
    console.log('loc', loc);
    const res: GridLocation[] = [];
    if (loc.y < this.currentGrid[0].length - 2) {
      const node = this.currentGrid[loc.x][loc.y + 2];
      const status = node.status;
      if (status === 1 || status === 2 || status === 4) {
        res.push(new GridLocation(loc.x, loc.y + 2, node.weight));
      }
    }
    if (loc.x < this.currentGrid.length - 2) {
      const node = this.currentGrid[loc.x + 2][loc.y];
      const status = node.status;
      if (status === 1 || status === 2 || status === 4) {
        res.push(new GridLocation(loc.x + 2, loc.y, node.weight));
      }
    }
    if (loc.y >= 2) {
      const node = this.currentGrid[loc.x][loc.y - 2];
      const status = node.status;
      if (status === 1 || status === 2 || status === 4) {
        res.push(new GridLocation(loc.x, loc.y - 2, node.weight));
      }
    }
    if (loc.x >= 2) {
      const node = this.currentGrid[loc.x - 2][loc.y];
      const status = node.status;
      if (status === 1 || status === 2 || status === 4) {
        res.push(new GridLocation(loc.x - 2, loc.y, node.weight));
      }
    }
    console.log('res', res);
    return res;
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
