import {PathFindingAlgorithmInterface} from './path-finding-algorithm.interface';
import {PathFindingAlgorithms, Node, PathFindingHeuristics, algoStatNames} from '../../../../types';
import {GridLocation} from '../../../@shared/GridLocation';

export class AStar implements PathFindingAlgorithmInterface {
  currentGrid: Node[][];
  algoStatNames: algoStatNames;

  constructor() {
    this.algoStatNames = {
      algoStatName1: 'TODO',
      algoStatName2: 'TODO',
      algoStatName3: 'TODO'
    };
  }

  public nextStep(): Node[][] {
    return this.currentGrid;
  }

  public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation, currentHeuristic: PathFindingHeuristics): void {
    return null;
  }

  public getAlgorithmName(): PathFindingAlgorithms {
    return 'A-Star';
  }

  getAlgorithmStatNames(): algoStatNames {
    return this.algoStatNames;
  }

  getUpdatedStats(): string {
    return 'drölf';
  }

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string {
    return 'a-star';
  }
}
