import {PathFindingAlgorithmInterface} from './path-finding-algorithm.interface';
import {PathFindingAlgorithm, Node, PathFindingHeuristics, AlgoStatNames} from '../../../../types';
import {GridLocation} from '../../../@shared/GridLocation';

export class Dijkstra implements PathFindingAlgorithmInterface {
  currentGrid: Node[][];
  algoStatNames: AlgoStatNames;

  constructor() {
    this.algoStatNames = {
      algoStatName1: null,
      algoStatName2: null,
      algoStatName3: null
    };
  }

  public nextStep(): Node[][] {
    return this.currentGrid;
  }

  public setInitialData(currentGrid: Node[][],
                        currentStartPoint: GridLocation,
                        currentHeuristic: PathFindingHeuristics): void {
    return null;
  }

  public getAlgorithmName(): PathFindingAlgorithm {
    return 'Dijkstra';
  }

  getAlgorithmStatNames(): AlgoStatNames {
    return this.algoStatNames;
  }

  getUpdatedStats(): string {
    return 'drölf';
  }

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string {
    return 'dijkstra';
  }
}
