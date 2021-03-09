import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import * as _ from 'lodash';
import {algoStatNames, Node, SavePointStats} from '../../../types';
import {SettingsService} from './settings.service';
import {MazeService} from './maze.service';
import {PathFindingService} from './path-finding.service';
import {GridLocation} from '../../@shared/GridLocation';
import {RecordService} from './record.service';


@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private readonly gridList$: BehaviorSubject<Node[][]>;

  private drawingMode: number;
  private readonly simulationSpeed$: BehaviorSubject<number>;
  private readonly isSimulationActive$: BehaviorSubject<boolean>;
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
      this.intervalID = setInterval(() => this.addStep(), 10000 / this.simulationSpeed$.getValue());
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
   * Actually sets the step for the new iteration
   *
   * @param newGrid - the current grid
   */
  public save(newGrid: Node[][]): void {
    this.setGridList(newGrid);
    this.recordService.setGridSavePointStats({
      iteration: this.recordService.getIteration(),
      algoStat1: this.recordService.getAlgoStat1(),
      algoStat2: this.recordService.getAlgoStat2(),
      algoStat3: this.recordService.getAlgoStat3()
    });
    // TODO CHECK IF WORKS
    this.recordService.setGridSavePoint(newGrid);
  }

  /**
   * creates a new step and everything that is needed
   * for step to continue. see grid component SimulationService.getStep
   */
  public addStep(): void {
    let newGrid: Node[][];
    if (this.settingsService.getAlgorithmMode() === 'maze') {
      if (this.recordService.getIteration() === 0) {
        this.mazeService.setInitialData(_.cloneDeep(
          this.gridList$.getValue()), this.recordService.getGridStartLocation());
      }
      newGrid = this.mazeService.getNextStep();
    } else {
      if (this.recordService.getIteration() === 0) {
        this.pathFindingService.setInitialData(_.cloneDeep(
          this.gridList$.getValue()), this.recordService.getGridStartLocation());
      }
      newGrid = this.pathFindingService.getNextStep();
    }
    if (newGrid) {
      this.setGridList(newGrid);
      this.recordService.setIteration(this.recordService.getIteration() + 1);
    } else {
      this.setSimulationStatus();
    }
    if (this.backwardStepsAmount$.getValue() < 9) {
      this.changeBackwardStepsAmount(1);
    }
  }

  /**
   * This manipulates the history of all tracked stats aas well as tge gridList
   * when the backwardsStep is called on the controller
   */
  public manipulateHistory(): void {
    this.recordService.setGridHistory(this.recordService.getGridHistory().slice(0, -1));
    this.setGridList(this.recordService.getGridHistory()[this.recordService.getGridHistory().length - 1]);
    this.recordService.setRewritingHistory(false);
    this.recordService.setAlgoStat3History(this.recordService.getAlgoStat3History().slice(0, -1));
    this.recordService.setAlgoStat3(this.recordService.getAlgoStat3History().length - 1);
    this.recordService.setAlgoStat2History(this.recordService.getAlgoStat2History().slice(0, -1));
    this.recordService.setAlgoStat2(this.recordService.getAlgoStat2History().length - 1);
    this.recordService.setAlgoStat1History(this.recordService.getAlgoStat1History().slice(0, -1));
    this.recordService.setAlgoStat1(this.recordService.getAlgoStat1History().length - 1);
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
   * This resets all stats and as well as the gridList
   */
  public reset(): void {
    this.setSimulationStatus(false);
    if (this.recordService.getIteration() > 0 && this.recordService.getGridSavePointStats()) {
      this.recordService.setIteration(this.recordService.getGridSavePointStats().iteration);
      this.recordService.setAlgoStat1(this.recordService.getGridSavePointStats().algoStat1);
      this.recordService.setAlgoStat2(this.recordService.getGridSavePointStats().algoStat2);
      this.recordService.setAlgoStat3(this.recordService.getGridSavePointStats().algoStat3);
      this.gridList$.next(this.recordService.getGridSavePoint());
    } else {
      this.recordService.setIteration(0);
      this.recordService.setAlgoStat1(0);
      this.recordService.setAlgoStat2(0);
      this.recordService.setAlgoStat3(0);
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
    this.recordService.setAlgoStat1(0);
    this.recordService.setAlgoStat2(0);
    this.recordService.setAlgoStat3(0);
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

  // TODO does this make sense here? I don't think so
  public getAlgorithmStatNames(): algoStatNames {
    if (this.settingsService.getAlgorithmMode() === 'maze') {
      return this.mazeService.getAlgorithmStatNames();
    } else {
      return this.pathFindingService.getAlgorithmStatNames();
    }
  }
}
