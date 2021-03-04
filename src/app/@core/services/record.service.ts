import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Node} from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private gridHistory: Array<Node[][]>;
  private iteration: number;
  private nodeCount: number;
  private nodesAlive: number;
  private nodesAliveHistory: Array<number>;
  private nodesCreated: number;
  private nodesCreatedHistory: Array<number>;
  private rewritingHistory: boolean;

  constructor() {
    this.gridHistory = [];
    // Stats
    this.iteration = 0;
    this.nodeCount = 0;
    this.nodesAlive = 0;
    this.nodesAliveHistory = [0];
    this.nodesCreated = 0;
    this.nodesCreatedHistory = [0];
    this.rewritingHistory = false;
  }

  /**
   * Is responsible to save the current state of the stats and
   * grids on a iteration by iteration basis so that it can be retrieved
   *
   * Also the maximum steps to be set are 9. The simulation needs n + 1 to work though
   *
   * @param gridList - the gridList used in the grid component
   */
  public setHistory(gridList: Node[][]): void {
    if (this.gridHistory.length >= 10) {
      this.gridHistory.shift();
      this.nodesCreatedHistory.shift();
      this.nodesAliveHistory.shift();
      this.gridHistory.push(gridList);
      // TODO: this if fixes an issue that only happens when the grid component is being initialized
      //  and would put the the last value twice... (also the if below)
      //  see if there is another way to fix it
      if (this.nodesCreatedHistory[this.nodesCreatedHistory.length - 1] !== this.nodesCreated) {
        this.nodesCreatedHistory.push(this.nodesCreated);
        this.nodesAliveHistory.push(this.nodesAlive);
      }
    } else {
      this.gridHistory.push(gridList);
      if (this.nodesCreatedHistory[this.nodesCreatedHistory.length - 1] !== this.nodesCreated) {
        this.nodesCreatedHistory.push(this.nodesCreated);
        this.nodesAliveHistory.push(this.nodesAlive);
      }
    }
  }


  public setGridHistory(newGridHistory: Array<Node[][]>): void {
    this.gridHistory = newGridHistory;
  }


  /**
   * Adds a new value to the current tick on every tick (very noice)
   *
   * @param value - the new value to be set
   */
  public setIteration(value: number): void {
    this.iteration = value;
  }

  /**
   * Sets a new value to the current cellCount
   *
   * @param newNodeCount - the new cellCount to be set
   */
  public setNodeCount(newNodeCount: number): void {
    this.nodeCount = newNodeCount;
  }

  /**
   * Adds a new value to the current nodesAlive on every iteration
   *
   * @param value - the new value to be set
   */
  public setNodesAlive(value: number): void {
    this.nodesAlive = value;
  }

  public setNodesAliveHistory(value: Array<number>): void {
    this.nodesAliveHistory = value;
  }

  public popNodesAliveHistory(): void {
    this.nodesAliveHistory.pop();
  }

  /**
   * Adds a new value to the current cellsCreated on every iteration
   *
   * @param value - the new value to be set
   */
  public setNodesCreated(value: number): void {
    this.nodesCreated = value;
  }

  public setNodesCreatedHistory(newArr: Array<number>): void {
    this.nodesCreatedHistory = newArr;
  }

  public addNodesCreatedHistory(value: number): void {
    this.nodesCreatedHistory.push(value);
  }


  public popNodesCreatedHistory(): void {
    this.nodesCreatedHistory.pop();
  }

  /**
   * A flag that has to be set in order not to overwrite the
   * history of the stats/gridList
   * @param newValue - a boolean that determines the status
   */
  public setRewritingHistory(newValue: boolean): void {
    this.rewritingHistory = newValue;
  }

  public getGridHistory(): Array<Node[][]> {
    return this.gridHistory;
  }

  /**
   * Returns the current iteration
   */
  public getIteration(): number {
    return this.iteration;
  }

  /**
   * Returns the current cellCount
   */
  public getNodeCount(): number {
    return this.nodeCount;
  }

  /**
   * Returns the current cellsAlive
   */
  public getNodesAlive(): number {
    return this.nodesAlive;
  }

  public getNodesAliveHistory(): Array<number> {
    return this.nodesAliveHistory;
  }

  /**
   * Returns the current cellsCreated
   */
  public getNodesCreated(): number {
    return this.nodesCreated;
  }

  public getNodesCreatedHistory(): Array<number> {
    return this.nodesAliveHistory;
  }

  /**
   * Returns the current rewritingHistory value
   */
  public getRewritingHistory(): boolean {
    return this.rewritingHistory;
  }
}
