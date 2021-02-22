import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {GridLocation, Node, SavePointStats} from '../../../types';


@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private readonly gridList$: ReplaySubject<Node[][]>;
  private readonly gridHistory: Array<Node[][]>;
  private gridSavePoint: Node[][];
  private gridSavePointStats: SavePointStats;
  private gridStartLocation: GridLocation;
  private gridGoalLocation: GridLocation;
  private readonly iteration: BehaviorSubject<number>;
  private readonly nodeCount$: BehaviorSubject<number>;
  private readonly nodesAlive$: BehaviorSubject<number>;
  private readonly nodesAliveHistory: Array<number>;
  private readonly nodesCreated$: BehaviorSubject<number>;
  private readonly nodesCreatedHistory: Array<number>;
  private rewritingHistory: boolean;
  private readonly simulationSpeed$: BehaviorSubject<number>;
  private drawingMode: number;
  private readonly disableController$: BehaviorSubject<boolean>;
  private readonly isSimulationActive$: BehaviorSubject<boolean>;
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

  constructor() {
    this.gridList$ = new ReplaySubject<Node[][]>(5);
    this.gridList$.next([]);
    this.gridHistory = [];
    this.gridSavePoint = [];
    this.gridStartLocation = null;
    this.gridGoalLocation = null;
    // Stats
    this.iteration = new BehaviorSubject<number>(0);
    this.nodeCount$ = new BehaviorSubject<number>(0);
    this.nodesAlive$ = new BehaviorSubject<number>(0);
    this.nodesAliveHistory = [0];
    this.nodesCreated$ = new BehaviorSubject<number>(0);
    this.nodesCreatedHistory = [0];
    this.rewritingHistory = false;
    // Responsible for controlling the simulation - also used to propagate
    // events from the controller component
    this.simulationSpeed$ = new BehaviorSubject(100);
    this.drawingMode = 0;
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
      this.intervalID = setInterval(() => this.addStep(), 50000 / this.simulationSpeed$.getValue());
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

  public setGridStartLocation(column: number, row: number): void {
    this.gridStartLocation = {x: column, y: row};
  }

  public setGridGoalLocation(column: number, row: number): void {
    this.gridGoalLocation = {x: column, y: row};
  }

  /**
   * Adds a new value to the current tick on every tick (very noice)
   *
   * @param value - the new value to be added
   */
  public changeIteration(value: number): void {
    this.iteration.next(this.iteration.getValue() + value);
  }

  /**
   * Sets a new value to the current cellCount
   *
   * @param newCellCount - the new cellCount to be set
   */
  public setCellCount(newCellCount: number): void {
    this.nodeCount$.next(newCellCount);
  }

  /**
   * Adds a new value to the current nodesAlive on every iteration
   *
   * @param value - the new value to be added
   */
  public changeNodesAlive(value: number): void {
    this.nodesAlive$.next(this.nodesAlive$.getValue() + value);
  }

  /**
   * Adds a new value to the current cellsCreated on every iteration
   *
   * @param value - the new value to be added
   */
  public changeCellsCreated(value: number): void {
    this.nodesCreated$.next(this.nodesCreated$.getValue() + value);
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
    this.gridList$.next(newGrid);
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
    this.gridSavePointStats = {
      iteration: this.iteration.getValue(),
      nodesAlive: this.nodesAlive$.getValue(),
      nodesCreated: this.nodesCreated$.getValue()
    };
    this.gridSavePoint = newGrid;
  }

  /**
   * creates a new step and everything that is needed
   * for step to continue. see grid component SimulationService.getStep
   */
  public addStep(): void {
    this.step$.next();
    if (this.backwardStepsAmount$.getValue() < 9) {
      this.changeBackwardStepsAmount(1);
    }
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
      if (this.nodesCreatedHistory[this.nodesCreatedHistory.length - 1] !== this.nodesCreated$.getValue()) {
        this.nodesCreatedHistory.push(this.nodesCreated$.getValue());
        this.nodesAliveHistory.push(this.nodesAlive$.getValue());
      }
    } else {
      this.gridHistory.push(gridList);
      if (this.nodesCreatedHistory[this.nodesCreatedHistory.length - 1] !== this.nodesCreated$.getValue()) {
        this.nodesCreatedHistory.push(this.nodesCreated$.getValue());
        this.nodesAliveHistory.push(this.nodesAlive$.getValue());
      }
    }
  }

  /**
   * A flag that has to be set in order not to overwrite the
   * history of the stats/gridList
   * @param newValue - a boolean that determines the status
   */
  public setRewritingHistory(newValue: boolean): void {
    this.rewritingHistory = newValue;
  }

  /**
   * This manipulates the history of all tracked stats aas well as tge gridList
   * when the backwardsStep is called on the controller
   */
  public manipulateHistory(): void {
    this.gridHistory.pop();
    this.setGridList(this.gridHistory[this.gridHistory.length - 1]);
    this.setRewritingHistory(false);
    this.nodesCreatedHistory.pop();
    this.nodesCreated$.next(this.nodesCreatedHistory[this.nodesCreatedHistory.length - 1]);
    this.nodesAliveHistory.pop();
    this.nodesAlive$.next(this.nodesAliveHistory[this.nodesAliveHistory.length - 1]);
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
    if (this.iteration.value > 0) {
      this.iteration.next(this.gridSavePointStats.iteration);
      this.nodesAlive$.next(this.gridSavePointStats.nodesAlive);
      this.nodesCreated$.next(this.gridSavePointStats.nodesCreated);
      this.gridList$.next(this.gridSavePoint);
    } else {
      this.iteration.next(0);
      this.nodesAlive$.next(0);
      this.nodesCreated$.next(0);
      this.gridList$.next([]);
    }
    this.backwardStepsAmount$.next(0);
    this.gridSavePoint = [];
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

  public getGridSavePoint(): Node[][] {
    return this.gridSavePoint;
  }

  public getGridStartLocation(): GridLocation {
    return this.gridStartLocation;
  }

  public getGridGoalLocation(): GridLocation {
    return this.gridGoalLocation;
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
   * Returns the current iteration
   */
  public getIteration(): Observable<number> {
    return this.iteration;
  }

  /**
   * Returns the current cellCount
   */
  public getNodeCount(): Observable<number> {
    return this.nodeCount$;
  }

  /**
   * Returns the current cellsAlive
   */
  public getNodesAlive(): Observable<number> {
    return this.nodesAlive$;
  }

  /**
   * Returns the current cellsCreated
   */
  public getNodesCreated(): Observable<number> {
    return this.nodesCreated$;
  }

  /**
   * Returns the current rewritingHistory value
   */
  public getRewritingHistory(): boolean {
    return this.rewritingHistory;
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
   * Returns when a new step was called
   */
  public getStep(): Observable<void> {
    return this.step$;
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
