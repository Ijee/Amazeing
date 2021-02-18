import {Injectable} from '@angular/core';
import {SimulationService} from './simulation.service';
import {Node, PathFindingAlgorithms, PathFindingHeuristics} from '../../../types';
import {AStar} from '../algorithm/path-finding/a-star';
import {PathFindingAlgorithm} from '../algorithm/path-finding/path-finding-algorithm';
import {Dijkstra} from '../algorithm/path-finding/dijkstra';


@Injectable({
  providedIn: 'root'
})
export class PathFindingService {
  private currentAlgorithm: PathFindingAlgorithm;
  private currentHeuristic: PathFindingHeuristics;

  constructor(private simulationService: SimulationService) {
    this.switchAlgorithm('Dijkstra');
    this.switchCurrentHeuristic('Manhattan');
  }

  /**
   * Switches the current maze algorithm for the
   *
   * @param newAlgo - the new algorithm to be used
   */
  public switchAlgorithm(newAlgo: PathFindingAlgorithms): void {
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
        break;
    }
  }

  public switchCurrentHeuristic(newHeuristic: PathFindingHeuristics): void {
    this.currentHeuristic = newHeuristic;
  }

  /**
   * Sets the next step for the grid based on the current algorithm
   *
   * @param currentGrid - the current grid that is displayed on the site
   */
  public nextStep(currentGrid: Node[][]): void {
    const nextStep: Node[][] = this.currentAlgorithm.nextStep(currentGrid, this.currentHeuristic);
    this.simulationService.setGridList(nextStep);
  }

  /**
   * Returns the name of the current algorithm
   */
  public getAlgorithmName(): PathFindingAlgorithms {
    return this.currentAlgorithm.getAlgorithmName();
  }

  public getCurrentHeuristic(): PathFindingHeuristics {
    return this.currentHeuristic;
  }

  public getPseudoCode(): string {
    return this.currentAlgorithm.getPseudoCode();
  }
}
