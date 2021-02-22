import {MazeAlgorithmInterface} from '../maze-algorithm.interface';
import {MazeAlgorithms, Node} from '../../../../../types';

export class Prims implements MazeAlgorithmInterface {
  isAlgorithmActive: boolean;

  constructor() {
   this.isAlgorithmActive = false;
  }

  public completeAlgorithm(currentGrid: Node[][]): Node[][] {
    return currentGrid;
  }

  public nextStep(currentGrid: Node[][]): Node[][] {
    return currentGrid;
  }

  public getAlgorithmName(): MazeAlgorithms {
    return 'Prims';
  }

  getUpdatedStats(): string {
    return 'drölf';
  }

  getIsAlgorithmActive(): boolean {
    return this.isAlgorithmActive;
  }

  /**
   * Returns the current algorithm pseudo code
   */
  getPseudoCode(): string {
    return 'prims';
  }
}
