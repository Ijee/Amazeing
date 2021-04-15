import {Injectable} from '@angular/core';
import {SimulationService} from './simulation.service';
import {AlgoStatNames, Node, PathFindingAlgorithm, PathFindingHeuristic} from '../../../types';
import {AStar} from '../algorithm/path-finding/a-star';
import {PathFindingAlgorithmInterface} from '../algorithm/path-finding/path-finding-algorithm.interface';
import {Dijkstra} from '../algorithm/path-finding/dijkstra';
import {GridLocation} from '../../@shared/GridLocation';


@Injectable({
  providedIn: 'root'
})
export class PathFindingService {
  private currentAlgorithm: PathFindingAlgorithmInterface;
  private currentHeuristic: PathFindingHeuristic;

  constructor() {
    this.switchAlgorithm('Dijkstra');
    this.switchCurrentHeuristic('Manhattan');
  }

  /**
   * Switches the current path finding algorithm
   *
   * @param newAlgo - the new algorithm to be used
   */
  public switchAlgorithm(newAlgo: PathFindingAlgorithm): void {
    switch (newAlgo) {
      case 'A-Star':
        this.currentAlgorithm = new AStar();
        break;
      case 'IDA-Star':
        break;
      case 'Dijkstra':
        this.currentAlgorithm = new Dijkstra();
        break;
      case 'Breadth-FS':
        break;
      case 'Depth-FS':
        break;
      case 'Best-FS':
        break;
      case 'Trace':
        break;
      case 'Jump-PS':
        break;
      case 'Orthogonal-Jump-PS':
        break;
      default:
        throw new Error('Unknown path-finding algorithm selected!');
    }
  }

  public switchCurrentHeuristic(newHeuristic: PathFindingHeuristic): void {
    this.currentHeuristic = newHeuristic;
  }

  public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
    this.currentAlgorithm.setInitialData(currentGrid, currentStartPoint, this.currentHeuristic);
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
  public getAlgorithmName(): PathFindingAlgorithm {
    return this.currentAlgorithm.getAlgorithmName();
  }

  /**
   * Returns an object that determines what the stat is supposed to represent
   */
  public getAlgorithmStatNames(): AlgoStatNames {
    return this.currentAlgorithm.getAlgorithmStatNames();
  }

  /**
   * Returns the currently selected heuristic
   */
  public getCurrentHeuristic(): PathFindingHeuristic {
    return this.currentHeuristic;
  }

  /**
   * Returns the pseudocode for the currently selected algorithm
   */
  public getPseudoCode(): string {
    return this.currentAlgorithm.getPseudoCode();
  }
}
