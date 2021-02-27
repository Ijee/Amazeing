import {Injectable} from '@angular/core';
import {MazeAlgorithms, Node} from '../../../types';
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
  public switchAlgorithm(newAlgo: MazeAlgorithms): void {
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
   * Returns the name of the current algorithm
   */
  public getAlgorithmName(): MazeAlgorithms {
    return this.currentAlgorithm.getAlgorithmName();
  }

  public getPseudoCode(): string {
    return this.currentAlgorithm.getPseudoCode();
  }
}
