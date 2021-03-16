import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import * as _ from 'lodash';
import {AlgoStatNames, MazeAlgorithm, Node, PathFindingAlgorithm, StatRecord} from '../../../types';
import {SettingsService} from './settings.service';
import {MazeService} from './maze.service';
import {PathFindingService} from './path-finding.service';
import {RecordService} from './record.service';


@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private readonly gridList$: BehaviorSubject<Node[][]>;

  private drawingMode: number;
  private readonly simulationSpeed$: BehaviorSubject<number>;
  private readonly isSimulationActive$: BehaviorSubject<boolean>;
  //  THIS IS CURRENTLY NOT BEING USED BUT MAY END UP BEING USEFUL AGAIN
  private readonly disableController$: BehaviorSubject<boolean>;
  private readonly backwardStep$: Subject<void>;
  private readonly backwardStepsAmount$: BehaviorSubject<number>;
  private readonly step$: Subject<void>;
  private readonly randomSeed$: Subject<void>;
  private readonly legend$: Subject<void>;
  private readonly importSession$: Subject<void>;
  private readonly exportSession$: Subject<void>;
  private readonly exportToken$: Subject<string>;
  private readonly importToken$: Subject<string>;
  private intervalID: number;

  constructor(private settingsService: SettingsService,
              private recordService: RecordService,
              private mazeService: MazeService,
              private pathFindingService: PathFindingService) {
    this.gridList$ = new BehaviorSubject<Node[][]>([]);
    this.drawingMode = 0;
    this.simulationSpeed$ = new BehaviorSubject(100);
    this.disableController$ = new BehaviorSubject<boolean>(false);
    this.isSimulationActive$ = new BehaviorSubject(false);
    this.backwardStep$ = new Subject<void>();
    this.backwardStepsAmount$ = new BehaviorSubject<number>(0);
    this.step$ = new Subject<void>();
    this.randomSeed$ = new Subject<void>();
    this.legend$ = new Subject<void>();
    this.importSession$ = new Subject<void>();
    this.exportSession$ = new Subject<void>();
    this.exportToken$ = new Subject<string>();
    this.importToken$ = new Subject<string>();
  }

  /**
   * Restarts the current interval that
   * is used to call the updateMessage method.
   */
  private restartInterval(): void {
    clearInterval(this.intervalID);
    if (this.isSimulationActive$.getValue()) {
      this.intervalID = setInterval(() => this.addIteration(), 10000 / this.simulationSpeed$.getValue());
    }
  }

  public getAlgorithmName(): MazeAlgorithm | PathFindingAlgorithm {
    if (this.settingsService.getAlgorithmMode() === 'maze') {
      return this.mazeService.getAlgorithmName();
    } else {
      return this.pathFindingService.getAlgorithmName();
    }
  }

  // TODO does this make sense here?
  public getAlgorithmStatNames(): AlgoStatNames {
    if (this.settingsService.getAlgorithmMode() === 'maze') {
      return this.mazeService.getAlgorithmStatNames();
    } else {
      return this.pathFindingService.getAlgorithmStatNames();
    }
  }

  /**
   * Determines the new simulation status to be either active or inactive
   *
   * @param status - the new status to be set and if not given will negate the current status
   */
  public setSimulationStatus(status?: boolean): void {
    if (status !== undefined) {
      this.isSimulationActive$.next(status);
    } else {
      this.isSimulationActive$.next(!(this.isSimulationActive$.getValue()));
    }
    this.restartInterval();
  }

  /**
   * Determines the new speed to be set based on upper and lower bounds
   *
   * @param speed - the new speed to be set
   * @private
   */
  private setSimulationSpeed(speed: number): void {
    const newSpeed = this.simulationSpeed$.getValue() + speed;
    this.simulationSpeed$.next(newSpeed);
    if (this.simulationSpeed$.getValue() < 20) {
      this.simulationSpeed$.next(20);
    } else if (this.simulationSpeed$.getValue() > 500) {
      this.simulationSpeed$.next(500);
    }
  }



  /**
   * Sets the new status of the controller to enabled or disabled
   *
   *  THIS IS CURRENTLY NOT BEING USED BUT MAY END UP BEING USEFUL AGAIN
   *
   * @param disabled - whether or not it should be disabled
   */
  public setDisableController(disabled: boolean): void {
    this.disableController$.next(disabled);
  }

  /**
   * Sets a new gridList as the current gridList
   *
   * @param newGrid - the new gridList
   */
  public setGridList(newGrid: Node[][]): void {
    this.gridList$.next(_.cloneDeep(newGrid));
  }

  /**
   * Responsible for the backwardStep although it does not include
   * the manipulateHistory() call as it needs to happen at another
   * point for it to work. see grid component
   */
  public setBackwardStep(): void {
    // disables auto-play of the simulation
    if (this.isSimulationActive$.getValue()) {
      this.isSimulationActive$.next(false);
      this.restartInterval();
    }
    if (this.backwardStepsAmount$.getValue() > 0) {
      this.changeBackwardStepsAmount(-1);
      this.backwardStep$.next();
    }
  }

  /**
   * (Don't question good method names or I will haunt you)
   * @param value
   * @private
   */
  private changeBackwardStepsAmount(value: number): void {
    this.backwardStepsAmount$.next(this.backwardStepsAmount$.value + value);
  }

  /**
   * Actually sets a step as a new iteration
   *
   * @param newGrid - the current grid
   */
  public save(newGrid: Node[][]): void {
    this.setGridList(newGrid);
    const currentStats = this.recordService.getCurrentStats();
    this.recordService.setGridSavePointStats({
      algoStat1: currentStats.algoStat1,
      algoStat2: currentStats.algoStat2,
      algoStat3: currentStats.algoStat3,
    });
    this.recordService.setGridSavePoint(newGrid);
  }

  /**
   * creates a new iteration and everything that is needed
   * for the iteration to continue.
   */
  public addIteration(): void {
    let newGrid: Node[][];
    let newStats: StatRecord;
    if (this.settingsService.getAlgorithmMode() === 'maze') {
      if (this.recordService.getIteration() === 0) {
        this.mazeService.setInitialData(_.cloneDeep(
          this.gridList$.getValue()), this.recordService.getGridStartLocation());
      }
      newGrid = this.mazeService.getNextStep();
      newStats = this.mazeService.getUpdatedStats();
      // const newStatHistory = [this.recordService.getStatRecordHistory(), newStats];
      // this.recordService.setStatRecordHistory(newStatHistory);
    } else {
      if (this.recordService.getIteration() === 0) {
        this.pathFindingService.setInitialData(_.cloneDeep(
          this.gridList$.getValue()), this.recordService.getGridStartLocation());
      }
      newGrid = this.pathFindingService.getNextStep();
      // TODO update path-finding interface + implementation like mazeService
    }
    if (newGrid) {
      this.setGridList(newGrid);
      this.recordService.setIteration(this.recordService.getIteration() + 1);
      this.recordService.addStatRecord(newStats);

    } else {
      this.setSimulationStatus();
    }
    if (this.backwardStepsAmount$.getValue() < 9) {
      this.changeBackwardStepsAmount(1);
    }
  }

  /**
   * Sets the new speed down between boundaries
   */
  public setSpeedDown(): void {
    this.simulationSpeed$.getValue() > 100 ? this.setSimulationSpeed(-100) : this.setSimulationSpeed(-20);
    this.restartInterval();
  }

  /**
   * Sets the new speed up between boundaries
   */
  public setSpeedUp(): void {
    this.simulationSpeed$.getValue() < 100 ? this.setSimulationSpeed(20) : this.setSimulationSpeed(100);
    this.restartInterval();
  }

  /**
   * This sets the mode for drawing on the grid.
   * You are only able to draw and clear walls nothing else.
   * newMode = -1: only clear nodes of their walls
   * newMode = 0: only draw new nodes on the grid
   * newMode = 1: draw a new start
   * newMode = 2: draw a new goal
   *
   * @param newMode - the new mode to be set for drawing
   */
  public setDrawingMode(newMode: number): void {
    if (this.getDrawingMode() === newMode) {
      this.drawingMode = 0;
    } else {
      this.drawingMode = newMode;
    }
  }

  /**
   * This resets
   */
  public reset(): void {
    this.setSimulationStatus(false);
    this.recordService.setIteration(0);
    if (this.recordService.getIteration() > 0 && this.recordService.getGridSavePointStats()) {
      // Soft reset
      this.recordService.addStatRecord(this.recordService.getGridSavePointStats());
      this.gridList$.next(this.recordService.getGridSavePoint());
    } else {
      // Hard reset
      console.log('in hard reset');
      this.recordService.resetHistory();
      this.gridList$.next([]);
      this.recordService.setGridSavePoint([]);
      this.recordService.setGridSavePointStats(null);
    }
    this.backwardStepsAmount$.next(0);
  }

  /**
   * This removes algorithm specific grid states as well as the stats
   */
  public softReset(): void {
    // deletes all the algorithm specific nodes from the grid
    const grid = _.cloneDeep(this.gridList$.value);
    grid.forEach(column => {
      column.forEach(node => {
        const status = node.nodeStatus;
        if (status !== 0 && status !== 1 && status !== 2) {
          node.nodeStatus = -1;
        }
      });
    });
    this.gridList$.next(grid);
    this.recordService.setIteration(0);
    this.recordService.resetHistory();
    this.backwardStepsAmount$.next(0);
    this.recordService.setGridSavePoint([]);
    this.recordService.setGridSavePointStats(null);
  }

  /**
   * Notifies all listener that a new randomSeed is called
   */
  public setRandomSeed(): void {
    this.randomSeed$.next();
  }

  /**
   * Notifies all listener that a new legend is called
   */
  public setLegend(): void {
    this.legend$.next();
  }

  /**
   * Notifies all listener that a new importSession is called
   */
  public setImportSession(): void {
    this.importSession$.next();
  }

  /**
   * Notifies all listener that a new exportSession is called
   */
  public setExportSession(): void {
    this.exportSession$.next();
  }

  /**
   * Sets the new exportToken
   *
   * @param token - the new token to be set
   */
  public setExportToken(token: string): void {
    this.exportToken$.next(token);
  }

  /**
   * Sets the new importToken
   *
   * @param token - the new token to be set
   */
  public setImportToken(token: string): void {
    this.importToken$.next(token);
  }

  /**
   * Returns the current gridList to any subscriber
   */
  public getGridList(): Observable<Node[][]> {
    return this.gridList$;
  }

  /**
   * Returns the status whether or not to disable the controller buttons
   *
   * THIS IS CURRENTLY NOT BEING USED BUT MAY END UP BEING USEFUL AGAIN
   */
  public getDisableController(): Observable<boolean> {
    return this.disableController$;
  }

  /**
   * Returns whether or not the simulation is currently active
   */
  public getSimulationStatus(): Observable<boolean> {
    return this.isSimulationActive$;
  }



  /**
   * Returns the current simulation speed
   */
  public getSimulationSpeed(): Observable<number> {
    return this.simulationSpeed$;
  }

  /**
   * Returns the current drawingMode
   */
  public getDrawingMode(): number {
    return this.drawingMode;
  }

  /**
   * Returns when a new backwardStep was called
   */
  public getBackwardStep(): Observable<void> {
    return this.backwardStep$;
  }

  /**
   * Returns the backwardStepsAmount
   */
  public getBackwardStepsAmount(): Observable<number> {
    return this.backwardStepsAmount$;
  }

  /**
   * Returns when a new RandomSeed was set
   */
  public getRandomSeed(): Observable<void> {
    return this.randomSeed$;
  }


  /**
   * Returns when a legend was clicked
   */
  public getLegend(): Observable<void> {
    return this.legend$;
  }


  /**
   * Returns when a new importSession was set
   */
  public getImportSession(): Observable<void> {
    return this.importSession$;
  }

  /**
   * Returns when a new exportSession was set
   */
  public getExportSession(): Observable<void> {
    return this.exportSession$;
  }

  /**
   * Returns when a new exportToken was set
   */
  public getExportToken(): Observable<string> {
    return this.exportToken$;
  }

  /**
   * Returns when a new importToken was set
   */
  public getImportToken(): Observable<string> {
    return this.importToken$;
  }
}
