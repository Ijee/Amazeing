import {MazeAlgorithmInterface} from '../maze-algorithm.interface';
import {AlgoStatNames, MazeAlgorithms, Node} from '../../../../../types';
import {HashSet} from '../../../../@shared/HashSet';
import {GridLocation} from '../../../../@shared/GridLocation';


/**
 * This is the implementation of the prims algorithm tailored for creating
 * a maze.
 *
 * All mazes are also based on the fact that a node can either be a wall or an empty node.
 */
export class Prims implements MazeAlgorithmInterface {
  currentGrid: Node[][];
  algoStatNames: AlgoStatNames;
  private readonly frontierNodes: HashSet<GridLocation>;


  constructor() {
    this.algoStatNames = {
      algoStatName1: 'Node Count',
      algoStatName2: 'Frontier Nodes'
    };
    this.frontierNodes = new HashSet<GridLocation>();
  }

  private addFrontier(xAxis: number, yAxis: number): void {
    if (xAxis >= 0 && yAxis >= 0 && xAxis < this.currentGrid.length && yAxis < this.currentGrid[0].length) {
      const status = this.currentGrid[xAxis][yAxis].nodeStatus;
      if (status === -1) {
        this.frontierNodes.add(new GridLocation(xAxis, yAxis));
        this.currentGrid[xAxis][yAxis].nodeStatus = 3;
      } else if (status === 2) {
        this.frontierNodes.add(new GridLocation(xAxis, yAxis));
      }
    }
  }

  private mark(xAxis: number, yAxis: number): void {
    const node = this.currentGrid[xAxis][yAxis];
    if (node.nodeStatus === 3) {
      // TODO 4 -> in
      node.nodeStatus = 4;
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
      const status = this.currentGrid[loc.x][loc.y + 2].nodeStatus;
      if (status === 1 || status === 2 || status === 4) {
        res.push(new GridLocation(loc.x, loc.y + 2));
      }
    }
    if (loc.x < this.currentGrid.length - 2) {
      const status = this.currentGrid[loc.x + 2][loc.y].nodeStatus;
      if (status === 1 || status === 2 || status === 4) {
        res.push(new GridLocation(loc.x + 2, loc.y));
      }
    }
    if (loc.y >= 2) {
      const status = this.currentGrid[loc.x][loc.y - 2].nodeStatus;
      if (status === 1 || status === 2 || status === 4) {
        res.push(new GridLocation(loc.x, loc.y - 2));
      }
    }
    if (loc.x >= 2) {
      const status = this.currentGrid[loc.x - 2][loc.y].nodeStatus;
      if (status === 1 || status === 2 || status === 4) {
        res.push(new GridLocation(loc.x - 2, loc.y));
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
          const status = this.currentGrid[xAxis][yAxis].nodeStatus;
          if (status === -1) {
            this.currentGrid[xAxis][yAxis].nodeStatus = 0;
          }
        }
      }
    }
  }

  private buildWayBetween(loc1: GridLocation, loc2: GridLocation): void {
    const x = (loc1.x + loc2.x) / 2;
    const y = (loc1.y + loc2.y) / 2;
    const node = this.currentGrid[x][y];
    if (node.nodeStatus === 0) {
      node.nodeStatus = 4;
    }
  }

  public nextStep(): Node[][] {
    if (this.frontierNodes.size() !== 0) {
      const randomFrontierItem = this.frontierNodes.getRandomItem();
      this.frontierNodes.remove(randomFrontierItem);
      this.buildWalls(randomFrontierItem);
      const neighbours = this.neighbours(randomFrontierItem);
      const randomNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
      this.buildWayBetween(randomFrontierItem, randomNeighbour);
      this.mark(randomFrontierItem.x, randomFrontierItem.y);
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

  public completeAlgorithm(currentGrid: Node[][]): Node[][] {
    return currentGrid;
  }

  public getAlgorithmName(): MazeAlgorithms {
    return 'Prims';
  }

  public getAlgorithmStatNames(): AlgoStatNames {
    return this.algoStatNames;
  }

  getUpdatedStats(): string {
    return 'drölf';
  }

  /**
   * Returns the current algorithm pseudo code
   */
  public getPseudoCode(): string {
    return 'prims';
  }
}
