import {MazeAlgorithmInterface} from '../maze-algorithm.interface';
import {AlgoStatNames, MazeAlgorithm, Node, StatRecord} from '../../../../../types';
import {HashSet} from '../../../../@shared/Classes/HashSet';
import {GridLocation} from '../../../../@shared/Classes/GridLocation';


/**
 * This is the implementation of the prims algorithm tailored for creating
 * a maze.
 *
 */
export class Prims implements MazeAlgorithmInterface {
  currentGrid: Node[][];
  algoStatNames: AlgoStatNames;
  algoStats: StatRecord;
  private frontierNodes: HashSet<GridLocation>;


  constructor() {
    this.algoStatNames = {
      algoStatName1: 'Node Count',
      algoStatName2: 'Frontier Nodes'
    };
    this.algoStats = {
      algoStat1: 0,
      algoStat2: 0,
    };
    this.frontierNodes = new HashSet<GridLocation>();
  }

  private addFrontier(xAxis: number, yAxis: number): void {
    if (xAxis >= 0 && yAxis >= 0 && xAxis < this.currentGrid.length
      && yAxis < this.currentGrid[0].length) {
      const node = this.currentGrid[xAxis][yAxis];
      const status = node.status;
      if (status === -1) {
        this.frontierNodes.add(new GridLocation(xAxis, yAxis, node.weight));
        this.currentGrid[xAxis][yAxis].status = 3;
        this.algoStats.algoStat1 += 1;
      } else if (status === 2) {
        this.frontierNodes.add(new GridLocation(xAxis, yAxis, node.weight));
      }
    }
  }

  private mark(xAxis: number, yAxis: number): void {
    const node = this.currentGrid[xAxis][yAxis];
    if (node.status === 3) {
      // TODO 4 -> in
      node.status = 4;
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
    return res;
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
    const x = (loc1.x + loc2.x) / 2;
    const y = (loc1.y + loc2.y) / 2;
    const node = this.currentGrid[x][y];
    if (node.status === 0) {
      node.status = 4;
    }
  }

  public nextStep(): Node[][] | null {
    if (this.frontierNodes.size() !== 0) {
      // const randomFrontierItem = this.frontierNodes.getRandomItem();
      let lowestWeightFrontiers: Array<GridLocation> = [];
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
      const selectedFrontierItem = lowestWeightFrontiers[Math.floor(Math.random() * lowestWeightFrontiers.length)];
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

  public updateAlgorithmState(newGrid: Node[][], algorithmState: any, algorithmStats: StatRecord): void {
    this.currentGrid = newGrid;
    this.algoStats = algorithmStats;
    this.frontierNodes = algorithmState.frontierNodes;
  }

  public deserialize(newGrid: Node[][], serializedState: any, algorithmStats: StatRecord): void {
    const tempFrontierNodes = new HashSet<GridLocation>();
    serializedState.gridLocations.forEach(item => {
      const tempGridLocation = new GridLocation(item.x, item.y, item.weight);
      tempFrontierNodes.add(tempGridLocation);
    });
    const deserializedState = {
      frontierNodes: tempFrontierNodes,
    };
    this.updateAlgorithmState(newGrid, deserializedState, algorithmStats);
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

  public getAlgorithmStatNames(): AlgoStatNames {
    return this.algoStatNames;
  }

  public getAlgorithmStats(): StatRecord {
    return this.algoStats;
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
