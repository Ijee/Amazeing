import {MazeAlgorithm} from './maze-algorithm';
import {MazeAlgorithms, Node} from '../../../../types';

export class Prims implements MazeAlgorithm {
  public nextStep(currentGrid: Node[][]): Node[][] {
    return currentGrid;
  }

  public completeAlgorithm(currentGrid: Node[][]): Node[][] {
    return currentGrid;
  }

  public getAlgorithmName(): MazeAlgorithms {
    return 'Prims';
  }

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string {
    return 'prims';
  }
}
