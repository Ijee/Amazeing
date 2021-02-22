import {Injectable} from '@angular/core';
import {SimulationService} from './simulation.service';
import {MazeAlgorithms, Node} from '../../../types';
import {MazeAlgorithmInterface} from '../algorithm/maze/maze-algorithm.interface';
import {Prims} from '../algorithm/maze/creation/prims';

@Injectable({
  providedIn: 'root'
})
export class MazeService {
  private currentAlgorithm: MazeAlgorithmInterface;

  constructor(private simulationService: SimulationService) {
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

  /**
   * Sets the next step for the grid based on the current algorithm
   *
   * @param currentGrid - the current grid that is displayed on the site
   */
  public nextStep(currentGrid: Node[][]): void {
    const nextStep: Node[][] = this.currentAlgorithm.nextStep(currentGrid);
    this.simulationService.setGridList(nextStep);
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
