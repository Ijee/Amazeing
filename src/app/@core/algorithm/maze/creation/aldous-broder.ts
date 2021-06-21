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
        name: 'Current Cursor',
        type: 'status-4',
      },
      {
        name: 'Discovered Nodes',
        type: 'status-5',
        currentValue: 0
      }
    ]);
  }

  nextStep(): Node[][] | null {
    if (this.remainingNodes >= 1) {
      const neighbours = this.getNeighbours(this.cursor, 2);
      const randomNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
      // Move the cursor position and visual representation to the next node.
      const oldCursor = this.cursor;
      const cursorNode = this.currentGrid[this.cursor.x][this.cursor.y];
      const cursorStatus = cursorNode.status;
      if (cursorStatus === 4) {
        cursorNode.status = 5;
      }
      this.cursor = randomNeighbour;
      const newCursorNode = this.currentGrid[this.cursor.x][this.cursor.y];
      const newCursorNodeStatus = newCursorNode.status;
      if (newCursorNodeStatus === 0 || newCursorNodeStatus === 5) {
        newCursorNode.status = 4;
      }

      if (newCursorNodeStatus === 0) {
        const statusChange = this.buildWalls(randomNeighbour, 0);
        this.buildPath(oldCursor, randomNeighbour, 5);
        this.statRecords[1].currentValue += statusChange.status0;
        this.remainingNodes -= statusChange.status0;
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
    // Note: the start and goal do not get counted so + 2 is necessary
    // for the break condition to work
    this.remainingNodes = this.gridWith * this.gridHeight + 2;

    this.cursor = currentStartPoint;
    const statusChange = this.buildWalls(currentStartPoint, 0);
    this.statRecords[1].currentValue += statusChange.status0 + 2;
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
