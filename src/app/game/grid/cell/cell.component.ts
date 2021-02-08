import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Alive} from '../../../../types';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  @Input('status-obj') statusObj: Alive;
  @Input('is-mouse-down') isMouseDown: boolean;
  @Output() wasUpdated: EventEmitter<boolean>;

  constructor() {
    this.wasUpdated = new EventEmitter<boolean>();
  }

  /**
   * Checks whether or not the cell should be reborn
   * as in negates the isAlive property
   *
   * @param bool - the boolean that determines the new state for the cell
   */
  reborn(bool: boolean): void {
    if (bool) {
      this.statusObj.isAlive = !this.statusObj.isAlive;
      this.wasUpdated.emit(this.statusObj.isAlive);
    }
  }
}
