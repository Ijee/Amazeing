import {Injectable} from '@angular/core';
import {GridStatHistory, Node, StatRecord} from '../../../types';
import {GridLocation} from '../../@shared/GridLocation';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private gridHistory: Array<Node[][]>;
  private gridSavePoint: Node[][];
  private gridSavePointStats: StatRecord;
  private gridStartLocation: GridLocation;
  private gridGoalLocation: GridLocation;
  private iteration: number;
  private statRecordHistory: Array<StatRecord>;
  private rewritingHistory: boolean;

  constructor() {
    this.gridHistory = [];
    this.gridSavePoint = [];
    this.gridStartLocation = null;
    this.gridGoalLocation = null;
    // Stats
    this.iteration = 0;
    this.statRecordHistory = [{
      algoStat1: 0,
      algoStat2: 0,
      algoStat3: 0
    }];
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
  public manageHistory(gridList: Node[][]): void {
    if (this.gridHistory.length >= 10) {
      this.gridHistory.shift();
      this.statRecordHistory.shift();
      this.gridHistory.push(gridList);
    } else {
      this.gridHistory.push(gridList);
    }
  }

  /**
   * This manipulates the history of all tracked stats aas well as tge gridList
   * when the backwardsStep is called on the controller
   */
  public manipulateHistory(): void {
    this.setIteration(this.iteration - 1);
    this.gridHistory.pop();
    this.statRecordHistory.pop();
    this.setRewritingHistory(false);
  }

  public setGridHistory(newGridHistory: Array<Node[][]>): void {
    this.gridHistory = newGridHistory;
  }

  public setGridSavePoint(newSavePoint: Node[][]): void {
    this.gridSavePoint = newSavePoint;
  }

  public setGridSavePointStats(newSavePointStats: StatRecord): void {
    this.gridSavePointStats = newSavePointStats;
  }

  public setGridStartLocation(column: number, row: number): void {
    this.gridStartLocation = new GridLocation(column, row);
  }

  public setGridGoalLocation(column: number, row: number): void {
    this.gridGoalLocation = new GridLocation(column, row);
  }

  /**
   * Sets the  new value to the current tick on every tick.
   *
   * @param value - the new value to be set
   */
  public setIteration(value: number): void {
    this.iteration = value;
  }

  /**
   * Adds a new entry to the stat history.
   *
   * @param newRecord - the new stat record
   */
  public addStatRecord(newRecord: StatRecord): void {
    this.statRecordHistory = [...this.statRecordHistory, _.clone(newRecord)];
  }

  /**
   * Fully resets the algorithm stats.
   */
  public resetHistory(): void {
    this.statRecordHistory = [{
      algoStat1: 0,
      algoStat2: 0,
      algoStat3: 0
    }];
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

  /**
   * Returns the grid save point.
   */
  public getGridSavePointStats(): StatRecord {
    return this.gridSavePointStats;
  }

  /**
   * Returns the grid start location.
   */
  public getGridStartLocation(): GridLocation {
    return this.gridStartLocation;
  }

  /**
   * Returns the grid goal location.
   */
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
   * Returns the current statRecordHistory
   */
  public getCurrentStats(): StatRecord {
    return this.statRecordHistory[this.statRecordHistory.length - 1];
  }

  /**
   * Returns the current rewritingHistory value
   */
  public getRewritingHistory(): boolean {
    return this.rewritingHistory;
  }
}
