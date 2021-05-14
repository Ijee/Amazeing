import {Component, OnDestroy, OnInit} from '@angular/core';
import {Node} from '../../../types';
import {SimulationService} from '../../@core/services/simulation.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';
import {SettingsService} from '../../@core/services/settings.service';
import {MazeService} from '../../@core/services/maze.service';
import {RecordService} from '../../@core/services/record.service';
import {GridLocation} from '../../@shared/classes/GridLocation';

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

  constructor(public simulationService: SimulationService,
              public recordService: RecordService,
              public settingsService: SettingsService,
              public mazeService: MazeService) {
    this.width = 47;
    this.height = 21;
    this.gridList = [];
    // init with no cells alive
    for (let i = 0; i < this.width; i++) {
      this.gridList[i] = [];
      for (let j = 0; j < this.height; j++) {
        this.gridList[i][j] = {status: -1, weight: 1};
      }
    }


    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
    // set initial start and goal
    const initialStartX = Math.round((33 * this.width) / 100);
    const initialGoalX = Math.round((66 * this.width) / 100);
    const initialNodeHeightY = Math.round((50 * this.height) / 100);
    const startNode = this.gridList[initialStartX][initialNodeHeightY];
    startNode.status = 1;
    this.recordService.setGridStartLocation(
      new GridLocation(initialStartX, initialNodeHeightY, startNode.weight));
    const goalNode = this.gridList[initialGoalX][initialNodeHeightY];
    goalNode.status = 2;
    this.recordService.setGridGoalLocation(new GridLocation(initialGoalX, initialNodeHeightY, goalNode.weight));
    this.simulationService.setGridList(this.gridList);
    // this.recordService.setAlgoStat1(this.width * this.height);
    this.simulationService.getGridList().pipe(takeUntil(this.destroyed$)).subscribe(data => {
      if (data.length) {
        data.forEach((column, i) => {
          column.forEach((cell, j) => {
            this.setCell(i, j, cell);
          });
        });
      } else {
        this.reset();
      }
    });
    this.simulationService.getRandomSeed().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.randomSeed();
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
        case 1:
        case 2:
          this.simulationService.setGridList(_.cloneDeep(this.gridList));
          break;
      }
      this.simulationService.setDrawingMode(-2);
    }
  }

  drawModeLogic(col: number, row: number): void {
    const oldStatus = this.gridList[col][row].status;
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
        const startLocation = this.recordService.getGridStartLocation();
        const startNode = this.gridList[startLocation.x][startLocation.y];
        startNode.status = -1;
        this.recordService.setGridStartLocation(new GridLocation(col, row, startNode.weight));
        this.onMouseUp();
        break;
      case 2:
        const goalLocation = this.recordService.getGridGoalLocation();
        const goalNode = this.gridList[goalLocation.x][goalLocation.y];
        goalNode.status = -1;
        this.recordService.setGridGoalLocation(new GridLocation(col, row, goalNode.weight));
        this.onMouseUp();
        break;
      default:
        break;
    }
    this.gridList[col][row].status = drawMode;
    // this.updateCellStats(drawMode);
  }

  /**
   * Changes the 'nodeStatus' object property
   * of a specific cell to the one requested
   * in the param.
   *
   * @param x - the x position
   * @param y - the y position
   * @param node - the node
   */
  public setCell(x: number, y: number, node: Node): void {
    const cell = this.gridList[x][y];
    cell.status = node.status;
    cell.weight = node.weight;
  }

  /**
   * Add random node weights between 0 - 9 to each node in the grid
   * and then saves it to the service.
   */
  public addNodeWeights(): void {
    this.gridList.forEach(column => {
      column.forEach(node => {
        node.weight = Math.floor(Math.random() * 10);
      });
    });
    this.simulationService.setGridList(_.cloneDeep(this.gridList));
    if (!this.simulationService.getShowWeightStatus()) {
      this.simulationService.toggleWeightStatus();
    }
  }

  /**
   * Resets all gridList cells back to the
   * start value.
   */
  private reset(): void {
    this.gridList.forEach(column => {
      column.forEach(node => {
        node.status = -1;
        node.weight = 1;
      });
    });
    const startLocation = this.recordService.getGridStartLocation();
    this.gridList[startLocation.x][startLocation.y].status = 1;
    const goalLocation = this.recordService.getGridGoalLocation();
    this.gridList[goalLocation.x][goalLocation.y].status = 2;
    this.simulationService.setGridList(_.cloneDeep(this.gridList));
  }

  /**
   * Populates and overwrites gridList with cells.
   */
  private randomSeed(): void {
    // this.simulationService.reset();
    // for (let i = 0; i < this.width; i++) {
    //   for (let j = 0; j < this.height; j++) {
    //     const rand = Math.random();
    //     if (rand < 0.2) {
    //       this.setCell(i, j, 0);
    //     } else {
    //       this.setCell(i, j, -1);
    //     }
    //   }
    // }
    // const startLocation = this.recordService.getGridStartLocation();
    // this.gridList[startLocation.x][startLocation.y].status = 1;
    // const goalLocation = this.recordService.getGridGoalLocation();
    // this.gridList[goalLocation.x][goalLocation.y].status = 2;
    // this.simulationService.save(_.cloneDeep(this.gridList));
  }

  /**
   * Resets and then imports new cells into the gridList
   * based on the importToken prop that gets passed down
   * App.vue.
   * The importToken is a string and its syntax looks
   * like this:
   * '[xPos,yPos],[xPos,yPos]...'.
   */
  // private importToken(token: string): void {
  //   this.reset();
  //   const regex = /\[\d+,\d+,\d+\]/gm;
  //   const tempArr = token.match(regex);
  //   if (tempArr) {
  //     tempArr.forEach((element) => {
  //       element = element.substring(1, element.length - 1);
  //       const xyz = element.split(',');
  //       this.setCell(+xyz[0], +xyz[1], +xyz[2]);
  //     });
  //     this.simulationService.setGridList(_.cloneDeep(this.gridList));
  //   }
  // }

  /**
   * Uses gridList to create an exportToken and
   * emits it up to to the export modal through the gameService.
   * Same format as in importToken().
   */
  // private exportSession(): void {
  //   let exportToken = '';
  //   for (let i = 0; i < this.width; i++) {
  //     for (let j = 0; j < this.height; j++) {
  //       const status = this.gridList[i][j].status;
  //       if (status >= 0) {
  //         exportToken += '[' + i + ',' + j + ',' + status + ']';
  //       }
  //     }
  //   }
  //   // this.simulationService.setExportToken(exportToken);
  // }
}
