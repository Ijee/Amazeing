import {MazeAlgorithmAbstract} from '../maze-algorithm.abstract';
import {MazeAlgorithm, Node, StatRecord} from '../../../../../types';
import {HashSet} from '../../../../@shared/classes/HashSet';
import {GridLocation} from '../../../../@shared/classes/GridLocation';


/**
 * This is the implementation of the Prims algorithm tailored for creating
 * a maze.
 */
export class Prims extends MazeAlgorithmAbstract {

  private frontierNodes: HashSet<GridLocation>;


  constructor() {
    super([], [
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
    ]);

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
      this.buildWalls(selectedFrontierItem, 0);
      const neighbours = this.getNeighbours(selectedFrontierItem, 2).filter(neighbour => {
        const status = this.currentGrid[neighbour.x][neighbour.y].status;
        // So that we can build a path between the randomLowestWeightFrontier and the randomNeighbour
        if (status === 2 || status === 3 || status === 5) {
          return neighbour;
        }
      });

      const randomNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
      this.buildPath(selectedFrontierItem, randomNeighbour, 5);
      this.mark(selectedFrontierItem.x, selectedFrontierItem.y);
      return this.currentGrid;
    }
    return null;
  }

  public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
    this.frontierNodes.clear();
    this.currentGrid = currentGrid;
    this.buildWalls(currentStartPoint, 0);
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
