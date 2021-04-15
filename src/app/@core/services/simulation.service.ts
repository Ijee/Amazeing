import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import * as _ from 'lodash';
import * as pako from 'pako';
import {
  AlgoStatNames,
  MazeAlgorithm,
  Node,
  PathFindingAlgorithm,
  PathFindingHeuristic,
  Session,
  StatRecord
} from '../../../types';
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
  private simulationSpeed: number;
  private isSimulationActive: boolean;
  //  THIS IS CURRENTLY NOT BEING USED BUT MAY END UP BEING USEFUL AGAIN
  private disableController: boolean;
  private backwardStepsAmount: number;
  private showWeightStatus: boolean;
  private readonly randomSeed$: Subject<void>;
  private readonly legend$: Subject<void>;
  private showImportModal: boolean;
  private showExportModal: boolean;
  private exportToken: string;
  private importToken: string;
  private intervalID: number;

  constructor(private settingsService: SettingsService,
              private recordService: RecordService,
              private mazeService: MazeService,
              private pathFindingService: PathFindingService) {
    this.gridList$ = new BehaviorSubject<Node[][]>([]);
    this.drawingMode = 0;
    this.simulationSpeed = 100;
    this.disableController = false;
    this.isSimulationActive = false;
    this.backwardStepsAmount = 0;
    this.randomSeed$ = new Subject<void>();
    this.legend$ = new Subject<void>();
    this.showImportModal = false;
    this.showExportModal = false;
    this.importToken = '';
  }

  /**
   * Restarts the current interval that
   * is used to call the updateMessage method.
   */
  private restartInterval(): void {
    clearInterval(this.intervalID);
    if (this.isSimulationActive) {
      this.intervalID = setInterval(() => this.addIteration(), 10000 / this.simulationSpeed);
    }
  }

  /**
   * Completes the current algorithm fully.
   */
  public completeAlgorithm(): void {
    if (this.settingsService.getAlgorithmMode() === 'maze') {
      if (this.recordService.getIteration() === 0) {
        this.mazeService.setInitialData(this.gridList$.getValue(), this.recordService.getGridStartLocation());
      }
      this.setGridList(this.mazeService.completeAlgorithm(this.gridList$.getValue()));
    } else {
      // TODO for path-finding service
      // this.setGridList(this.pathFindingService.completeAlgorithm(this.gridList$.getValue()));
    }
    this.setSimulationStatus(false);
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
      this.isSimulationActive = status;
    } else {
      this.isSimulationActive = !this.isSimulationActive;
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
    if (this.simulationSpeed < 20) {
      this.simulationSpeed = 20;
    } else if (this.simulationSpeed > 500) {
      this.simulationSpeed = 500;
    } else {
      this.simulationSpeed = this.simulationSpeed + speed;
    }
  }


  /**
   * Sets the new status of the controller to enabled or disabled
   *
   *  THIS IS CURRENTLY NOT BEING USED BUT MAY END UP BEING USEFUL AGAIN
   *
   * @param isDisabled - whether or not it should be disabled
   */
  public setDisableController(isDisabled: boolean): void {
    this.disableController = isDisabled;
  }

  /**
   * Sets a new gridList as the current gridList
   *
   * @param newGrid - the new gridList
   */
  public setGridList(newGrid: Node[][]): void {
    const grid = _.cloneDeep(newGrid);
    this.gridList$.next(grid);
    this.recordService.manageGridHistory(grid);
  }

  /**
   * Responsible for the backwardStep although it does not include
   * the manipulateHistory() call as it needs to happen at another
   * point for it to work. see grid component
   */
  public setBackwardStep(): void {
    // disables auto-play of the simulation
    if (this.isSimulationActive) {
      this.isSimulationActive = false;
      this.restartInterval();
    }
    if (this.backwardStepsAmount > 0) {
      this.changeBackwardStepsAmount(-1);
      this.recordService.manipulateHistory();
      if (this.settingsService.getAlgorithmMode() === 'maze') {
        this.mazeService.updateAlgorithmState(this.gridList$.getValue(),
          this.recordService.getCurrentAlgorithmState(),
          this.recordService.getCurrentStats(),
          false);
      } else {
        // TODO update path-finding service to the new definitions on mazeService / the interface
      }
      this.gridList$.next(this.recordService.getCurrentGrid());
    }
  }

  /**
   * Changes the backwardsStepAmount.
   * @param value - the new value to be added
   * @private
   */
  private changeBackwardStepsAmount(value: number): void {
    this.backwardStepsAmount = this.backwardStepsAmount + value;
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
    let newAlgorithmState: any;
    if (this.settingsService.getAlgorithmMode() === 'maze') {
      if (this.recordService.getIteration() === 0) {
        this.mazeService.setInitialData(_.cloneDeep(
          this.gridList$.getValue()), this.recordService.getGridStartLocation());
      }
      newGrid = this.mazeService.getNextStep();
      newStats = this.mazeService.getAlgorithmStats();
      newAlgorithmState = this.mazeService.getCurrentAlgorithmState();
      console.log('newAlgorithmState', newAlgorithmState);
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
      this.recordService.addAlgorithmState(newAlgorithmState);
    } else {
      this.setSimulationStatus();
    }
    if (this.backwardStepsAmount < 9) {
      this.changeBackwardStepsAmount(1);
    }
  }

  /**
   * Sets the new speed down between boundaries
   */
  public setSpeedDown(): void {
    this.simulationSpeed > 100 ? this.setSimulationSpeed(-100) : this.setSimulationSpeed(-20);
    this.restartInterval();
  }

  /**
   * Sets the new speed up between boundaries
   */
  public setSpeedUp(): void {
    this.simulationSpeed < 100 ? this.setSimulationSpeed(20) : this.setSimulationSpeed(100);
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
   * This resets the grid and everythign associated with it.
   * First resets does a reset to the grid save point.
   * Second one does a hard reset
   */
  public reset(): void {
    this.setSimulationStatus(false);
    if (this.recordService.getIteration() > 0 && this.recordService.getGridSavePointStats()) {
      // Resets to save point
      this.recordService.setIteration(0);
      this.recordService.addStatRecord(this.recordService.getGridSavePointStats());
      this.gridList$.next(this.recordService.getGridSavePoint());
    } else {
      // Hard reset
      this.recordService.setIteration(0);
      this.recordService.resetStatRecordHistory();
      this.gridList$.next([]);
      this.recordService.setGridSavePoint([]);
      this.recordService.setGridSavePointStats(null);
    }
    this.backwardStepsAmount = 0;
    this.recordService.resetAlgorithmStateHistory();
  }

  /**
   * This prepares or rather removes algorithm specific grid states and stats
   */
  public prepareGrid(): void {
    // deletes all the algorithm specific nodes from the grid
    const grid = _.cloneDeep(this.gridList$.value);
    grid.forEach(column => {
      column.forEach(node => {
        const status = node.status;
        if (status > 2) {
          node.status = -1;
        }
      });
    });
    this.gridList$.next(grid);
    this.recordService.setIteration(0);
    this.recordService.resetStatRecordHistory();
    this.backwardStepsAmount = 0;
    this.recordService.setGridSavePoint([]);
    this.recordService.setGridSavePointStats(null);
  }

  /**
   * This toggles whether or not to show weight status
   */
  public toggleWeightStatus(): void {
    this.showWeightStatus = !this.showWeightStatus;
  }

  /**
   * Notifies all listener that a new randomSeed is called.
   */
  public setRandomSeed(): void {
    this.randomSeed$.next();
  }

  /**
   * Toggles whether or not the import modal should be shown
   */
  public toggleShowImportModal(): void {
    this.showImportModal = !this.showImportModal;
  }

  /**
   * Toggles whether or not the export modal should be shown
   */
  public toggleShowExportModal(): void {
    this.showExportModal = !this.showExportModal;
  }

  /**
   * Notifies all listener that a new legend is called.
   */
  public setLegend(): void {
    this.legend$.next();
  }

  /**
   * Tries to set all the important information for the new session.
   *
   * @param session - the new session to be used
   */
  public importSession(session: Session): void {
    let serializedInput: any;
    try {
      serializedInput = JSON.parse(pako.inflate(this.exportToken, { to: 'string' }));
    } catch (error) {
      throw new Error('Input string is invalid.');
    }
    this.settingsService.setAlgorithmMode(session.algorithmMode);
    if (this.settingsService.getAlgorithmMode() === 'maze') {
      this.mazeService.switchAlgorithm(session.algorithm as MazeAlgorithm);
      this.mazeService.updateAlgorithmState(session.grid, session.algorithmState,
        session.algorithmStats, true);
    } else {
      this.pathFindingService.switchAlgorithm(session.algorithm as PathFindingAlgorithm);
      // TODO set path-finding updateAlgorithmState
    }
    // TODO set heuristic for path-finding service
  }

  public exportSession(): void {
    if (this.settingsService.getAlgorithmMode() === 'maze') {
      const exportSession: Session = {
        algorithm: this.mazeService.getAlgorithmName() as MazeAlgorithm,
        algorithmMode: this.settingsService.getAlgorithmMode(),
        algorithmState: this.mazeService.getSerializedState(),
        algorithmStats: this.mazeService.getAlgorithmStats(),
        grid: this.gridList$.getValue()
      };
      this.exportToken = pako.deflate(JSON.stringify(exportSession));
    } else {
      // TODO sync mazeService with path-finding service to make this object assignable
    }

  }

  /**
   * Returns the current gridList to any subscriber.
   */
  public getGridList(): Observable<Node[][]> {
    return this.gridList$;
  }

  /**
   * Returns the status whether or not to disable the controller buttons.
   *
   * THIS IS CURRENTLY NOT BEING USED BUT MAY END UP BEING USEFUL AGAIN
   */
  public getDisableController(): boolean {
    return this.disableController;
  }

  /**
   * Returns whether or not the simulation is currently active.
   */
  public getSimulationStatus(): boolean {
    return this.isSimulationActive;
  }

  /**
   * Returns the current simulation speed.
   */
  public getSimulationSpeed(): number {
    return this.simulationSpeed;
  }

  /**
   * Returns the current drawingMode.
   */
  public getDrawingMode(): number {
    return this.drawingMode;
  }

  /**
   * Returns the backwardStepsAmount.
   */
  public getBackwardStepsAmount(): number {
    return this.backwardStepsAmount;
  }

  /**
   * Returns when the toggle was clicked.
   */
  public getShowWeightStatus(): boolean {
    return this.showWeightStatus;
  }

  /**
   * Returns when a new RandomSeed was set.
   */
  public getRandomSeed(): Observable<void> {
    return this.randomSeed$;
  }


  /**
   * Returns when a legend was clicked.
   */
  public getLegend(): Observable<void> {
    return this.legend$;
  }


  /**
   * Returns whether or not the import modal should be shown.
   */
  public get getShowImportModal(): boolean {
    return this.showImportModal;
  }


  /**
   * Returns whether or not the export modal should be shown.
   */
  public getShowExportModal(): boolean {
    return this.showExportModal;
  }

  /**
   * Returns the current exportToken.
   */
  public getExportToken(): string {
    return this.exportToken;
  }

  /**
   * Returns when a new importToken was set.
   */
  public getImportToken(): string {
    return this.importToken;
  }
}
