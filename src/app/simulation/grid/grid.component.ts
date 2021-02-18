import {Component, OnDestroy, OnInit} from '@angular/core';
import {Node} from '../../../types';
import {SimulationService} from '../../@core/services/simulation.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';
import {SettingsService} from '../../@core/services/settings.service';
import {MazeService} from '../../@core/services/maze.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnDestroy {

  private readonly width: number;
  private readonly height: number;
  public gridList: Node[][];
  public isMouseDown: boolean;

  private readonly destroyed$: Subject<void>;
  private isInitialized: boolean;

  constructor(public simulationService: SimulationService, public settingsService: SettingsService, public mazeService: MazeService) {
    this.width = 46;
    this.height = 20;
    this.gridList = [];
    // init with no cells alive
    for (let i = 0; i < this.width; i++) {
      this.gridList[i] = [];
      for (let j = 0; j < this.height; j++) {
        this.gridList[i][j] = {nodeStatus: -1};
      }
    }


    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
    // set initial start and goal
    const initialStartX = Math.round((33 * this.width) / 100);
    const initialGoalX = Math.round((66 * this.width) / 100);
    const initialNodeHeightY = Math.round((50 * this.height) / 100);
    this.gridList[initialStartX][initialNodeHeightY].nodeStatus = 1;
    this.simulationService.setGridStartLocation(initialStartX, initialNodeHeightY);
    this.gridList[initialGoalX][initialNodeHeightY].nodeStatus = 2;
    this.simulationService.setGridGoalLocation(initialGoalX, initialNodeHeightY);
    this.simulationService.setGridList(this.gridList);
    this.simulationService.setCellCount(this.width * this.height);
    // if you're asking yourself: 'why did this madman use a replaysubject?
    // I liked the name and also no it is not better to use than a normal array as
    // also have the gridHistory in the gameService.
    this.simulationService.getGridList().pipe(takeUntil(this.destroyed$)).subscribe(data => {
      if (data.length) {
        data.forEach((column, i) => {
          column.forEach((cell, j) => {
            this.setCell(i, j, cell.nodeStatus);
          });
        });
      } else {
        this.reset();
      }
      if (!this.simulationService.getRewritingHistory()) {
        this.simulationService.setHistory(data);
      }
    });

    this.simulationService.getBackwardStep().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.simulationService.setRewritingHistory(true);
      this.simulationService.manipulateHistory();
      this.simulationService.changeIteration(-1);
    });
    this.simulationService.getStep().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.update();
      this.simulationService.changeIteration(1);
    });
    this.simulationService.getRandomSeed().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.randomSeed();
    });
    this.simulationService.getImportToken().pipe(takeUntil(this.destroyed$)).subscribe((token: string) => {
      this.importToken(token);
    });
    this.simulationService.getExportSession().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.exportSession();
    });
    this.isInitialized = true;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Is responsible for creating a tick onMouseUp so you can
   * reverse it with a backward step
   */
  onMouseUp(): void {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      switch (this.simulationService.getDrawingMode()) {
        case -1:
        case 0:
          this.simulationService.save(_.cloneDeep(this.gridList));
          break;
      }
      this.simulationService.setDrawingMode(-2);
    }
  }

  /**
   * Updates the current cell stats on each new tick.
   *
   * @param newValue - the new cell status
   */
  updateCellStats(newValue: number): void {
    switch (newValue) {
      case -1:
        this.simulationService.changeNodesAlive(-1);
        break;
      case 0:
        this.simulationService.changeNodesAlive(1);
        this.simulationService.changeCellsCreated(1);
        break;
    }
  }

  drawModeLogic(col: number, row: number): void {
    const oldStatus = this.gridList[col][row].nodeStatus;
    let drawMode = this.simulationService.getDrawingMode();
    if (drawMode < -1) {
      if (oldStatus === 0) {
        drawMode = -1;
      } else {
        drawMode = 0;
      }
      this.simulationService.setDrawingMode(drawMode);
    }
    if (oldStatus === 1 || oldStatus === 2 || oldStatus === drawMode) {
      return;
    }
    switch (drawMode) {
      case 1:
        const startLocation = this.simulationService.getGridStartLocation();
        this.gridList[startLocation.x][startLocation.y].nodeStatus = -1;
        this.simulationService.setGridStartLocation(col, row);
        this.onMouseUp();
        break;
      case 2:
        const goalLocation = this.simulationService.getGridGoalLocation();
        this.gridList[goalLocation.x][goalLocation.y].nodeStatus = -1;
        this.simulationService.setGridGoalLocation(col, row);
        this.onMouseUp();
        break;
      default:
        break;
    }
    this.gridList[col][row].nodeStatus = drawMode;
    this.updateCellStats(drawMode);
  }

  /**
   * Changes the 'nodeStatus' object property
   * of a specific cell to the one requested
   * in the param.
   *
   * @param x - the x position
   * @param y - the y position
   * @param nodeStatus - the new boolean
   */
  public setCell(x: number, y: number, nodeStatus: number): void {
    if (this.gridList[x][y].nodeStatus !== nodeStatus) {
      this.gridList[x][y].nodeStatus = nodeStatus;

      if (this.isInitialized) {
        this.updateCellStats(nodeStatus);
      }
    }
    // let row = this.gridList[x];
    // row.splice(y, 1, {nodeStatus: true});
    // this.gridList.splice(x, 1, row);
  }

  /**
   * Returns the amount of neighbours for
   * a specific cell on the grid.
   *
   * @param posX - the x position
   * @param posY - the Y position
   * @return neighbours - amount of neighbours
   */
  private getNeighbours(posX: number, posY: number): number {
    let neighbours = 0;
    if (posX <= this.width && posY <= this.height) {
      for (let offsetX = -1; offsetX < 2; offsetX++) {
        for (let offsetY = -1; offsetY < 2; offsetY++) {
          const newX = posX + offsetX;
          const newY = posY + offsetY;
          // check if offset is:
          // on current cell, out of bounds and if nodeStatus
          // for cell true
          if (
            (offsetX !== 0 || offsetY !== 0) &&
            newX >= 0 &&
            newX < this.width &&
            newY >= 0 &&
            newY < this.height &&
            this.gridList[posX + offsetX][posY + offsetY].nodeStatus === 0
          ) {
            neighbours++;
          }
        }
      }
    }
    return neighbours;
  }

  /**
   * The main function that updates the grid
   * every tick based on the game of life rules.
   */
  private update(): void {
    const tempArr: Node[][] = [];
    for (let i = 0; i < this.width; i++) {
      tempArr[i] = [];
      for (let j = 0; j < this.height; j++) {
        const status = this.gridList[i][j].nodeStatus;
        const neighbours = this.getNeighbours(i, j);
        let result = -1;
        // Rule 1:
        // Any live cell with fewer than two live neighbours dies,
        // as if by under population
        if (status && neighbours < 2) {
          result = -1;
        }
        // Rule 2:
        // Any live cell with two or three neighbours lives on
        // to the next generation
        if ((status && neighbours === 2) || neighbours === 3) {
          result = 0;
        }
        // Rule 3:
        // Any live cell with more than three live neighbours dies,
        // as if by overpopulation
        if (status && neighbours > 3) {
          result = -1;
        }
        // Rule 4:
        // Any dead cell with exactly three live neighbours becomes
        // a live cell, as if by reproduction
        if (!status && neighbours === 3) {
          result = 0;
        }
        tempArr[i][j] = {nodeStatus: result};
      }
    }
    // set new gridList content
    this.simulationService.setGridList(tempArr);
  }

  public update2(): void {
    this.mazeService.nextStep(this.gridList);
  }

  /**
   * Resets all gridList cells back to the
   * start value.
   */
  private reset(): void {
    this.gridList.forEach(col => {
      col.forEach(cell => {
        cell.nodeStatus = -1;
      });
    });
    const startLocation = this.simulationService.getGridStartLocation();
    this.gridList[startLocation.x][startLocation.y].nodeStatus = 1;
    const goalLocation = this.simulationService.getGridGoalLocation();
    this.gridList[goalLocation.x][goalLocation.y].nodeStatus = 2;
  }

  /**
   * Populates and overwrites gridList with cells.
   */
  private randomSeed(): void {
    this.simulationService.reset();
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const rand = Math.random();
        if (rand < 0.2) {
          this.setCell(i, j, 0);
        } else {
          this.setCell(i, j, -1);
        }
      }
    }
    const startLocation = this.simulationService.getGridStartLocation();
    this.gridList[startLocation.x][startLocation.y].nodeStatus = 1;
    const goalLocation = this.simulationService.getGridGoalLocation();
    this.gridList[goalLocation.x][goalLocation.y].nodeStatus = 2;
    this.simulationService.save(_.cloneDeep(this.gridList));
  }

  /**
   * Resets and then imports new cells into the gridList
   * based on the importToken prop that gets passed down
   * App.vue.
   * The importToken is a string and its syntax looks
   * like this:
   * '[xPos,yPos],[xPos,yPos]...'.
   */
  private importToken(token: string): void {
    this.reset();
    const regex = /\[\d+,\d+\]/gm;
    const tempArr = token.match(regex);
    if (tempArr) {
      tempArr.forEach((element) => {
        element = element.substring(1, element.length - 1);
        const xy = element.split(',');
        this.setCell(+xy[0], +xy[1], 0);
      });
    }
  }

  /**
   * Uses gridList to create an exportToken and
   * emits it up to to the export modal through the gameService.
   * Same format as in importToken().
   */
  private exportSession(): void {
    let exportToken = '';
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.gridList[i][j].nodeStatus) {
          exportToken += '[' + i + ',' + j + ']';
        }
      }
    }
    this.simulationService.setExportToken(exportToken);
  }
}
