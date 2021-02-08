import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {Alive} from '../../../types';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly gridList$: ReplaySubject<Alive[][]>;
  private readonly gridHistory: Array<Alive[][]>;
  private readonly tick$: BehaviorSubject<number>;
  private readonly cellCount$: BehaviorSubject<number>;
  private readonly cellsAlive$: BehaviorSubject<number>;
  private readonly cellsAliveHistory: Array<number>;
  private readonly cellsCreated$: BehaviorSubject<number>;
  private readonly cellsCreatedHistory: Array<number>;
  private rewritingHistory: boolean;
  private readonly gameSpeed$: BehaviorSubject<number>;
  private readonly disableController$: BehaviorSubject<boolean>;
  private readonly isGameActive$: BehaviorSubject<boolean>;
  private readonly backwardStep$: Subject<void>;
  private readonly backwardStepsAmount$: BehaviorSubject<number>;
  private readonly step$: Subject<void>;
  private readonly randomSeed$: Subject<void>;
  private readonly importSession$: Subject<void>;
  private readonly exportSession$: Subject<void>;
  private readonly exportToken$: Subject<string>;
  private readonly importToken$: Subject<string>;

  private intervalID: number;

  constructor() {
    this.gridList$ = new ReplaySubject<Alive[][]>(5);
    this.gridList$.next([]);
    this.gridHistory = [];
    // Stats
    this.tick$ = new BehaviorSubject<number>(0);
    this.cellCount$ = new BehaviorSubject<number>(0);
    this.cellsAlive$ = new BehaviorSubject<number>(0);
    this.cellsAliveHistory = [0];
    this.cellsCreated$ = new BehaviorSubject<number>(0);
    this.cellsCreatedHistory = [0];
    this.rewritingHistory = false;
    // Responsible for controlling the simulation - also used to propagate
    // events from the controller component
    this.gameSpeed$ = new BehaviorSubject(100);
    this.disableController$ = new BehaviorSubject<boolean>(false);
    this.isGameActive$ = new BehaviorSubject(false);
    this.backwardStep$ = new Subject<void>();
    this.backwardStepsAmount$ = new BehaviorSubject<number>(0);
    this.step$ = new Subject<void>();
    this.randomSeed$ = new Subject<void>();
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
    if (this.isGameActive$.getValue()) {
      this.intervalID = setInterval(() => this.addStep(), 50000 / this.gameSpeed$.getValue());
    }
  }

  /**
   * Determines the new game status to be either active or inactive
   *
   * @param status - the new status to be set and if not given will negate the current status
   */
  public setGameStatus(status?: boolean): void {
    if (status !== undefined) {
      this.isGameActive$.next(status);
    } else {
      this.isGameActive$.next(!(this.isGameActive$.getValue()));
    }
    this.restartInterval();
  }

  /**
   * Determines the new speed to be set based on upper and lower bounds
   *
   * @param speed - the new speed to be set
   * @private
   */
  private setGameSpeed(speed: number): void {
    const newSpeed = this.gameSpeed$.getValue() + speed;
    this.gameSpeed$.next(newSpeed);
    if (this.gameSpeed$.getValue() < 20) {
      this.gameSpeed$.next(20);
    } else if (this.gameSpeed$.getValue() > 500) {
      this.gameSpeed$.next(500);
    }
  }

  /**
   * Adds a new value to the current tick on every tick (very noice)
   *
   * @param value - the new value to be added
   */
  public changeTick(value: number): void {
    this.tick$.next(this.tick$.getValue() + value);
  }

  /**
   * Sets a new value to the current cellCount
   *
   * @param newCellCount - the new cellCount to be set
   */
  public setCellCount(newCellCount: number): void {
    this.cellCount$.next(newCellCount);
  }

  /**
   * Adds a new value to the current cellsAlive on every tick
   *
   * @param value - the new value to be added
   */
  public changeCellsAlive(value: number): void {
    this.cellsAlive$.next(this.cellsAlive$.getValue() + value);
  }

  /**
   * Adds a new value to the current cellsCreated on every tick
   *
   * @param value - the new value to be added
   */
  public changeCellsCreated(value: number): void {
    this.cellsCreated$.next(this.cellsCreated$.getValue() + value);
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
  public setGridList(newGrid: Alive[][]): void {
    this.gridList$.next(newGrid);
  }

  /**
   * Responsible for the backwardStep although it does not include
   * the manipulateHistory() call as it needs to happen at another
   * point for it to work. see grid component
   */
  public setBackwardStep(): void {
    // disables auto-play of the simulation
    if (this.isGameActive$.getValue()) {
      this.isGameActive$.next(false);
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
   * Actually sets the step for the new tick
   *
   * @param newGrid - the current grid
   */
  public setStep(newGrid: Alive[][]): void {
    this.setGridList(newGrid);
    this.changeTick(1);
    if (this.backwardStepsAmount$.getValue() < 9) {
      this.changeBackwardStepsAmount(1);
    }
  }

  /**
   * creates a new step and everything that is needed
   * for step to continue. see grid component gameService.getStep
   */
  public addStep(): void {
    this.step$.next();
    if (this.backwardStepsAmount$.getValue() < 9) {
      this.changeBackwardStepsAmount(1);
    }
  }

  /**
   * Is responsible to save the current state of the stats and
   * grids on a tick by tick basis so that it can be retrieved
   *
   * Also the maximum steps to be set are 9. The simulation needs n + 1 to work though
   *
   * @param gridList - the gridList used in the grid component
   */
  public setHistory(gridList: Alive[][]): void {
    if (this.gridHistory.length >= 10) {
      this.gridHistory.shift();
      this.cellsCreatedHistory.shift();
      this.cellsAliveHistory.shift();
      this.gridHistory.push(gridList);
      // TODO: this if fixes an issue that only happens when the grid component is being initialized
      //  and would put the the last value twice... (also the if below)
      //  see if there is another way to fix it
      if (this.cellsCreatedHistory[this.cellsCreatedHistory.length - 1] !== this.cellsCreated$.getValue()) {
        this.cellsCreatedHistory.push(this.cellsCreated$.getValue());
        this.cellsAliveHistory.push(this.cellsAlive$.getValue());
      }
    } else {
      this.gridHistory.push(gridList);
      if (this.cellsCreatedHistory[this.cellsCreatedHistory.length - 1] !== this.cellsCreated$.getValue()) {
        this.cellsCreatedHistory.push(this.cellsCreated$.getValue());
        this.cellsAliveHistory.push(this.cellsAlive$.getValue());
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
    this.cellsCreatedHistory.pop();
    this.cellsCreated$.next(this.cellsCreatedHistory[this.cellsCreatedHistory.length - 1]);
    this.cellsAliveHistory.pop();
    this.cellsAlive$.next(this.cellsAliveHistory[this.cellsAliveHistory.length - 1]);
  }

  /**
   * Sets the new speed down between boundaries
   */
  public setSpeedDown(): void {
    this.gameSpeed$.getValue() > 100 ? this.setGameSpeed(-100) : this.setGameSpeed(-20);
    this.restartInterval();
  }

  /**
   * Sets the new speed up between boundaries
   */
  public setSpeedUp(): void {
    this.gameSpeed$.getValue() < 100 ? this.setGameSpeed(20) : this.setGameSpeed(100);
    this.restartInterval();
  }

  /**
   * This resets all stats and as well as the gridList
   */
  public reset(): void {
    this.backwardStepsAmount$.next(0);
    this.tick$.next(0);
    this.cellsAlive$.next(0);
    this.cellsCreated$.next(0);
    this.gridList$.next([]);
  }

  /**
   * Notifies all listener that a new randomSeed is called
   */
  public setRandomSeed(): void {
    this.randomSeed$.next();
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
  public getGridList(): Observable<Alive[][]> {
    return this.gridList$;
  }

  /**
   * Returns the status whether or not to disable the controller buttons
   */
  public getDisableController(): Observable<boolean> {
    return this.disableController$;
  }

  /**
   * Returns whether or not the game is currently active
   */
  public getGameStatus(): Observable<boolean> {
    return this.isGameActive$;
  }

  /**
   * Returns the current tick
   */
  public getTick(): Observable<number> {
    return this.tick$;
  }

  /**
   * Returns the current cellCount
   */
  public getCellCount(): Observable<number> {
    return this.cellCount$;
  }

  /**
   * Returns the current cellsAlive
   */
  public getCellsAlive(): Observable<number> {
    return this.cellsAlive$;
  }

  /**
   * Returns the current cellsCreated
   */
  public getCellsCreated(): Observable<number> {
    console.log('current cellsCreated:', this.cellsCreated$.getValue());
    return this.cellsCreated$;
  }

  /**
   * Returns the current rewritingHistory value
   */
  public getRewritingHistory(): boolean {
    return this.rewritingHistory;
  }

  /**
   * Returns the current gameSpeed
   */
  public getGameSpeed(): Observable<number> {
    return this.gameSpeed$;
  }

  /**
   * Returns when a new backwardStep was called
   */
  public getBackwardStep(): Observable<void> {
    return this.backwardStep$;
  }

  /**
   * Returns when a new RandomSeed was set
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
