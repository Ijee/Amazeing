import {Component, OnDestroy, OnInit} from '@angular/core';
import {Alive} from '../../../types';
import {GameService} from '../../@core/services/game.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnDestroy {

  private readonly width: number;
  private readonly height: number;
  public gridList: Alive[][];
  public isMouseDown: boolean;

  private readonly destroyed$: Subject<void>;
  private isInitialized: boolean;

  constructor(public gameService: GameService) {
    this.width = 46;
    this.height = 20;
    this.gridList = [];
    // init with no cells alive
    for (let i = 0; i < this.width; i++) {
      this.gridList[i] = [];
      for (let j = 0; j < this.height; j++) {
        this.gridList[i][j] = {isAlive: false};
      }
    }

    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.gameService.setCellCount(this.width * this.height);
    // if you're asking yourself: 'why did this madman use a replaysubject?
    // I liked the name and also no it is not better to use than a normal array as
    // also have the gridHistory in the gameService.
    this.gameService.getGridList().pipe(takeUntil(this.destroyed$)).subscribe(data => {
      if (data.length) {
        data.forEach((column, i) => {
          column.forEach((cell, j) => {
            this.setCell(i, j, cell.isAlive);
          });
        });
      } else {
        this.reset();
      }
      if (!this.gameService.getRewritingHistory()) {
        this.gameService.setHistory(data);
      }
    });
    this.gameService.getBackwardStep().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.gameService.setRewritingHistory(true);
      this.gameService.manipulateHistory();
      this.gameService.changeTick(-1);
    });
    this.gameService.getStep().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.update();
      this.gameService.changeTick(1);
    });
    this.gameService.getRandomSeed().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.randomSeed();
    });
    this.gameService.getImportToken().pipe(takeUntil(this.destroyed$)).subscribe((token: string) => {
      this.importToken(token);
    });
    this.gameService.getExportSession().pipe(takeUntil(this.destroyed$)).subscribe(() => {
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
      // forces drawing a line / cells to be a tick in the simulation until the mouse releases
      // this.gameService.setStep(_.cloneDeep(this.gridList));
      this.gameService.setStep(_.cloneDeep(this.gridList));
    }
  }

  /**
   * Updates the current cell stats on each new tick.
   *
   * @param bool - boolean based on cell isAlive status
   */
  updateCellStats(bool: boolean): void {
    if (bool) {
      this.gameService.changeCellsAlive(1);
      this.gameService.changeCellsCreated(1);
    } else {
      this.gameService.changeCellsAlive(-1);
    }
  }

  /**
   * Changes the 'isAlive' object property
   * of a specific cell to the one requested
   * in the param.
   *
   * @param x - the x position
   * @param y - the y position
   * @param alive - the new boolean
   */
  private setCell(x: number, y: number, alive: boolean): void {
    if (this.gridList[x][y].isAlive !== alive) {
      this.gridList[x][y].isAlive = alive;

      if (this.isInitialized) {
        this.updateCellStats(alive);
      }
    }
    // let row = this.gridList[x];
    // row.splice(y, 1, {isAlive: true});
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
          // on current cell, out of bounds and if isAlive
          // for cell true
          if (
            (offsetX !== 0 || offsetY !== 0) &&
            newX >= 0 &&
            newX < this.width &&
            newY >= 0 &&
            newY < this.height &&
            this.gridList[posX + offsetX][posY + offsetY].isAlive === true
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
    const tempArr: Alive[][] = [];
    for (let i = 0; i < this.width; i++) {
      tempArr[i] = [];
      for (let j = 0; j < this.height; j++) {
        const status = this.gridList[i][j].isAlive;
        const neighbours = this.getNeighbours(i, j);
        let result = false;
        // Rule 1:
        // Any live cell with fewer than two live neighbours dies,
        // as if by under population
        if (status && neighbours < 2) {
          result = false;
        }
        // Rule 2:
        // Any live cell with two or three neighbours lives on
        // to the next generation
        if ((status && neighbours === 2) || neighbours === 3) {
          result = true;
        }
        // Rule 3:
        // Any live cell with more than three live neighbours dies,
        // as if by overpopulation
        if (status && neighbours > 3) {
          result = false;
        }
        // Rule 4:
        // Any dead cell with exactly three live neighbours becomes
        // a live cell, as if by reproduction
        if (!status && neighbours === 3) {
          result = true;
        }
        tempArr[i][j] = {isAlive: result};
      }
    }
    // set new gridList content
    this.gameService.setGridList(tempArr);
  }

  /**
   * Resets all gridList cells back to the
   * start value.
   */
  private reset(): void {
    this.gridList.forEach(col => {
      col.forEach(cell => {
        cell.isAlive = false;
      });
    });
  }

  /**
   * Populates and overwrites gridList with cells.
   */
  private randomSeed(): void {
    this.gameService.reset();
    this.gameService.setStep(_.cloneDeep(this.gridList));
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const rand = Math.random();
        if (rand < 0.2) {
          this.setCell(i, j, true);
        } else {
          this.setCell(i, j, false);
        }
      }
    }
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
        this.setCell(+xy[0], +xy[1], true);
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
        if (this.gridList[i][j].isAlive) {
          exportToken += '[' + i + ',' + j + ']';
        }
      }
    }
    this.gameService.setExportToken(exportToken);
  }
}
