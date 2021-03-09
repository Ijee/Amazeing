import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Node, SavePointStats} from '../../../types';
import {GridLocation} from '../../@shared/GridLocation';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private gridHistory: Array<Node[][]>;
  private gridSavePoint: Node[][];
  private gridSavePointStats: SavePointStats;
  private gridStartLocation: GridLocation;
  private gridGoalLocation: GridLocation;
  private iteration: number;
  private algoStat1: number;
  private algoStat1History: Array<number>;
  private algoStat2: number;
  private algoStat2History: Array<number>;
  private algoStat3: number;
  private algoStat3History: Array<number>;
  private rewritingHistory: boolean;

  constructor() {
    this.gridHistory = [];
    this.gridSavePoint = [];
    this.gridStartLocation = null;
    this.gridGoalLocation = null;
    // Stats
    this.iteration = 0;
    this.algoStat1 = 0;
    this.algoStat1History = [0];
    this.algoStat2 = 0;
    this.algoStat2History = [0];
    this.algoStat3 = 0;
    this.algoStat3History = [0];
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
      this.algoStat3History.shift();
      this.algoStat2History.shift();
      this.algoStat1History.shift();
      this.gridHistory.push(gridList);
      // TODO: this if fixes an issue that only happens when the grid component is being initialized
      //  and would put the the last value twice... (also the if below)
      //  see if there is another way to fix it
      if (this.algoStat3History[this.algoStat3History.length - 1] !== this.algoStat3) {
        this.algoStat3History.push(this.algoStat3);
        this.algoStat2History.push(this.algoStat2);
        this.algoStat1History.push(this.algoStat1);
      }
    } else {
      this.gridHistory.push(gridList);
      if (this.algoStat3History[this.algoStat3History.length - 1] !== this.algoStat3) {
        this.algoStat3History.push(this.algoStat3);
        this.algoStat2History.push(this.algoStat2);
        this.algoStat1History.push(this.algoStat1);
      }
    }
  }

  public updateAlgorithmStats(): void {
    return null;
  }

  public setGridHistory(newGridHistory: Array<Node[][]>): void {
    this.gridHistory = newGridHistory;
  }

  public setGridSavePoint(newSavePoint: Node[][]): void {
    this.gridSavePoint = newSavePoint;
  }

  public setGridSavePointStats(newSavePointStats: SavePointStats): void {
    this.gridSavePointStats = newSavePointStats;
  }

  public setGridStartLocation(column: number, row: number): void {
    this.gridStartLocation = new GridLocation(column, row);
  }

  public setGridGoalLocation(column: number, row: number): void {
    this.gridGoalLocation = new GridLocation(column, row);
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
   * Sets the new value for the first tracked algorithm stat
   *
   * @param value - the new value to be set
   */
  public setAlgoStat1(value: number): void {
    this.algoStat1 = value;
  }

  /**
   * Sets the history that is being tracked on each iteration for the first algorithm stat
   *
   * @param value - the new arr to be set
   */
  public setAlgoStat1History(value: Array<number>): void {
    this.algoStat1History = value;
  }

  /**
   * Sets the new value for the second tracked algorithm stat
   *
   * @param value - the new value to be set
   */
  public setAlgoStat2(value: number): void {
    this.algoStat2 = value;
  }

  /**
   * Sets the history that is being tracked on each iteration for the second algorithm stat
   *
   * @param value - the new arr to be set
   */
  public setAlgoStat2History(value: Array<number>): void {
    this.algoStat2History = value;
  }

  /**
   * Sets the new value for the third tracked algorithm stat
   *
   * @param value - the new value to be set
   */
  public setAlgoStat3(value: number): void {
    this.algoStat3 = value;
  }

  /**
   * Sets the history that is being tracked on each iteration for the third algorithm stat
   *
   * @param value - the new arr to be set
   */
  public setAlgoStat3History(value: Array<number>): void {
    this.algoStat3History = value;
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

  public getGridSavePoint(): Node[][] {
    return this.gridSavePoint;
  }

  public getGridSavePointStats(): SavePointStats {
    return this.gridSavePointStats;
  }

  public getGridStartLocation(): GridLocation {
    return this.gridStartLocation;
  }

  public getGridGoalLocation(): GridLocation {
    return this.gridGoalLocation;
  }

  /**
   * Returns the current iteration
   */
  public getIteration(): number {
    return this.iteration;
  }

  /**
   * Returns the algorithm stats that is tracked on the first variable
   */
  public getAlgoStat1(): number {
    return this.algoStat1;
  }

  /**
   * Returns the history of the first tracked algorithm stat
   */
  public getAlgoStat1History(): Array<number> {
    return this.algoStat1History;
  }

  /**
   * Returns the algorithm stats that is tracked on the second variable
   */
  public getAlgoStat2(): number {
    return this.algoStat2;
  }

  /**
   * Returns the history of the second tracked algorithm stat
   */
  public getAlgoStat2History(): Array<number> {
    return this.algoStat2History;
  }

  /**
   * Returns the algorithm stats that is tracked on the third variable
   */
  public getAlgoStat3(): number {
    return this.algoStat3;
  }

  /**
   * Returns the history of the third tracked algorithm stat
   */
  public getAlgoStat3History(): Array<number> {
    return this.algoStat3History;
  }

  /**
   * Returns the current rewritingHistory value
   */
  public getRewritingHistory(): boolean {
    return this.rewritingHistory;
  }
}
