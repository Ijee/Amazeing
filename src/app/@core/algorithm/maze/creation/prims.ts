import {MazeAlgorithmInterface} from '../maze-algorithm.interface';
import {MazeAlgorithm, Node, StatRecord} from '../../../../../types';
import {HashSet} from '../../../../@shared/classes/HashSet';
import {GridLocation} from '../../../../@shared/classes/GridLocation';


/**
 * This is the implementation of the Prims algorithm tailored for creating
 * a maze.
 */
export class Prims implements MazeAlgorithmInterface {
  currentGrid: Node[][];
  statRecords: StatRecord[];
  private frontierNodes: HashSet<GridLocation>;


  constructor() {
    this.statRecords = [
      {
        name: 'Frontier Nodes',
        type: 'status-4',
        currentValue: 0,
      },
      {
        name: 'Testie Test',
        type: 'status-6',
        currentValue: 0,
      },
      {
        name: 'Testie Test',
        type: 'status-6',
        currentValue: 0,
      },
      {
        name: 'In',
        type: 'status-5'
      }
    ];
    this.frontierNodes = new HashSet<GridLocation>();
  }

  private addFrontier(xAxis: number, yAxis: number): void {
    if (xAxis >= 0 && yAxis >= 0 && xAxis < this.currentGrid.length
      && yAxis < this.currentGrid[0].length) {
      const node = this.currentGrid[xAxis][yAxis];
      const status = node.status;
      if (status === 0) {
        this.frontierNodes.add(new GridLocation(xAxis, yAxis, node.weight));
        this.currentGrid[xAxis][yAxis].status = 4;
        this.statRecords[0].currentValue += 1;
      } else if (status === 3) {
        this.frontierNodes.add(new GridLocation(xAxis, yAxis, node.weight));
      }
    }
  }

  private mark(xAxis: number, yAxis: number): void {
    const node = this.currentGrid[xAxis][yAxis];
    if (node.status === 4) {
      // TODO 5 -> in
      node.status = 5;
    }
    // marks neighbours as frontierNodes
    this.addFrontier(xAxis - 2, yAxis);
    this.addFrontier(xAxis + 2, yAxis);
    this.addFrontier(xAxis, yAxis - 2);
    this.addFrontier(xAxis, yAxis + 2);
  }

  private neighbours(loc: GridLocation): GridLocation[] {
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

  private buildWalls(loc: GridLocation): void {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const xAxis = loc.x + i;
        const yAxis = loc.y + j;
        if (xAxis >= 0 && yAxis >= 0 && xAxis < this.currentGrid.length && yAxis < this.currentGrid[0].length) {
          const status = this.currentGrid[xAxis][yAxis].status;
          if (status === 0) {
            this.currentGrid[xAxis][yAxis].status = 1;
          }
        }
      }
    }
  }

  private buildWayBetween(loc1: GridLocation, loc2: GridLocation): void {
    const x = (loc1.x + loc2.x) / 2;
    const y = (loc1.y + loc2.y) / 2;
    const node = this.currentGrid[x][y];
    if (node.status === 1) {
      node.status = 5;
    }
  }

  private getRandomLowestWeightFrontier(): GridLocation {
    let lowestWeightFrontiers: GridLocation[] = [];
    this.frontierNodes.forEach(item => {
      if (lowestWeightFrontiers.length === 0) {
        lowestWeightFrontiers.push(item);
      } else if (item.weight < lowestWeightFrontiers[lowestWeightFrontiers.length - 1].weight) {
        lowestWeightFrontiers = [];
        lowestWeightFrontiers.push(item);
      } else if (item.weight === lowestWeightFrontiers[lowestWeightFrontiers.length - 1].weight) {
        lowestWeightFrontiers.push(item);
      }
    });
    // select one item from the lowest weighted items randomly
    return lowestWeightFrontiers[Math.floor(Math.random() * lowestWeightFrontiers.length)];
  }

  public nextStep(): Node[][] | null {
    if (this.frontierNodes.size() !== 0) {
      // const randomFrontierItem = this.frontierNodes.getRandomItem();
      const selectedFrontierItem = this.getRandomLowestWeightFrontier();
      this.frontierNodes.remove(selectedFrontierItem);
      this.buildWalls(selectedFrontierItem);
      const neighbours = this.neighbours(selectedFrontierItem);
      const randomNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
      this.buildWayBetween(selectedFrontierItem, randomNeighbour);
      this.mark(selectedFrontierItem.x, selectedFrontierItem.y);
      return this.currentGrid;
    }
    return null;
  }

  public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
    this.frontierNodes.clear();
    this.currentGrid = currentGrid;
    this.buildWalls(currentStartPoint);
    this.mark(currentStartPoint.x, currentStartPoint.y);
  }

  public updateAlgorithmState(newGrid: Node[][], algorithmState: any, statRecords: StatRecord[]): void {
    this.currentGrid = newGrid;
    this.statRecords = statRecords;
    this.frontierNodes = algorithmState.frontierNodes;
  }

  public deserialize(newGrid: Node[][], serializedState: any, statRecords: StatRecord[]): void {
    const tempFrontierNodes = new HashSet<GridLocation>();
    serializedState.gridLocations.forEach(item => {
      const tempGridLocation = new GridLocation(item.x, item.y, item.weight);
      tempFrontierNodes.add(tempGridLocation);
    });
    const deserializedState = {
      frontierNodes: tempFrontierNodes,
    };
    this.updateAlgorithmState(newGrid, deserializedState, statRecords);
  }

  public getSerializedState(): any {
    const serializedState = {
      gridLocations: []
    };
    this.frontierNodes.forEach(gridLocation => {
      serializedState.gridLocations.push(gridLocation.toObject());
    });
    return serializedState;
  }

  public getAlgorithmName(): MazeAlgorithm {
    return 'Prims';
  }

  public getStatRecords(): StatRecord[] {
    return this.statRecords;
  }

  public getCurrentAlgorithmState(): any {
    return {
      frontierNodes: this.frontierNodes
    };
  }

  public usesNodeWeights(): boolean {
    return true;
  }
}
