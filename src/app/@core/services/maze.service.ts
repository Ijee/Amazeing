import {Injectable} from '@angular/core';
import {AlgoStatNames, MazeAlgorithm, Node, StatRecord} from '../../../types';
import {MazeAlgorithmInterface} from '../algorithm/maze/maze-algorithm.interface';
import {Prims} from '../algorithm/maze/creation/prims';
import {GridLocation} from '../../@shared/GridLocation';

@Injectable({
  providedIn: 'root'
})
export class MazeService {
  private currentAlgorithm: MazeAlgorithmInterface;

  constructor() {
    this.switchAlgorithm('Prims');
  }

  /**
   * Switches the current maze algorithm for the
   *
   * @param newAlgo - the new algorithm to be used
   */
  public switchAlgorithm(newAlgo: MazeAlgorithm): void {
    switch (newAlgo) {
      case 'Prims':
        this.currentAlgorithm = new Prims();
        break;
      case 'Kruskals':
        break;
      case 'Aldous-Broder':
        break;
      case 'Wilsons':
        break;
      case 'Ellers':
        break;
      case 'Sidewinder':
        break;
      case 'Hunt-and-Kill':
        break;
      case 'Growing-Tree':
        break;
      case 'Binary-Tree':
        break;
      case 'Recursive-Backtracker':
        break;
      case 'Recursive-Division':
        break;
      case 'Cellular-Automation':
        break;
      case 'Pledge':
        break;
      case 'Trémaux':
        break;
      case 'Recursive':
        break;
      case 'Dead-End-Filling':
        break;
      case 'Maze-Routing':
        break;
      default:
        this.currentAlgorithm = new Prims();
    }
  }

  public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
    this.currentAlgorithm.setInitialData(currentGrid, currentStartPoint);
  }

  /**
   * Sets the next step for the grid based on the current algorithm
   */
  public getNextStep(): Node[][] {
    return this.currentAlgorithm.nextStep();
  }

  /**
   * Returns the last step of an algorithm.
   * Or rather - it completed the algorithm entirely.
   *
   * @param currentGrid - the currentGrid
   */
  public completeAlgorithm(currentGrid: Node[][]): Node[][] {
    let algorithmEnded = false;
    let lastGrid: Node[][];
    while (!algorithmEnded) {
      console.log('completeAlgorithm while');
      const tempGrid = this.getNextStep();
      if (tempGrid === null) {
        algorithmEnded = true;
      } else {
        lastGrid = tempGrid;
        console.log('in else');
      }
    }
    return lastGrid;
  }

  /**
   * Returns the name of the current algorithm
   */
  public getAlgorithmName(): MazeAlgorithm {
    return this.currentAlgorithm.getAlgorithmName();
  }

  /**
   * Returns an object that determines what the stat is supposed to represent
   */
  public getAlgorithmStatNames(): AlgoStatNames {
    return this.currentAlgorithm.getAlgorithmStatNames();
  }

  /**
   * Returns the stats for the current iteration
   */
  public getUpdatedStats(): StatRecord {
    return this.currentAlgorithm.getUpdatedStats();
  }

  /**
   * Returns the pseudocode for the currently selected algorithm
   */
  public getPseudoCode(): string {
    return this.currentAlgorithm.getPseudoCode();
  }
}
