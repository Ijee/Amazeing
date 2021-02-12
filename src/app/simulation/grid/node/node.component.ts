import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Node} from '../../../../types';
import {SimulationService} from '../../../@core/services/simulation.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {
  @Input('status-obj') statusObj: Node;
  @Input('is-mouse-down') isMouseDown: boolean;
  @Output() wasUpdated: EventEmitter<number>;
  @Output() drawModeLogic: EventEmitter<string>;

  constructor(private simulationService: SimulationService) {
    this.wasUpdated = new EventEmitter<number>();
    this.drawModeLogic = new EventEmitter<string>();
  }

  /**
   * Determines the class that has to be set for the cell
   * to get its proper styling
   *
   */
  determineStatus(): string {
    switch (this.statusObj.nodeStatus) {
      case 0:
        return 'wall';
      case 1:
        // start
        return 'has-background-primary';
      case 2:
        // goal
        return 'has-background-danger';
      default:
        return 'dead';
    }
  }

  /**
   * Checks whether or not the cell should be reborn
   * as in negates the isAlive property
   *
   */
  setNewStatus(bool: boolean): void {
    if (bool) {
      this.statusObj.nodeStatus = this.simulationService.getDrawingMode();
      // let's you only draw one start / goal
      if (this.simulationService.getDrawingMode() === 1  ||
        this.simulationService.getDrawingMode() ===  2) {
        console.log('yo trying to emit');
        this.drawModeLogic.emit('startOrGoal');
      }
      this.wasUpdated.emit(this.statusObj.nodeStatus);
    }
  }
}
