import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SimulationService} from '../../../@core/services/simulation.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {
  @Input() status: number;
  @Input('is-mouse-down') isMouseDown: boolean;
  @Output() wasUpdated: EventEmitter<void>;

  constructor(private simulationService: SimulationService) {
    this.wasUpdated = new EventEmitter<void>();
  }

  getNodeClasses(): string {
    const first = this.determineStatus();
    const second = this.determineDrawMode();
    return second ? first + ' ' + second : first;
  }

  determineDrawMode(): string {
    switch (this.simulationService.getDrawingMode()) {
      case 1:
        return 'start';
      case 2:
        return 'goal';
    }
  }

  /**
   * Determines the class that has to be set for the cell
   * to get its proper styling
   *
   */
  determineStatus(): string {
    switch (this.status) {
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
      this.wasUpdated.emit();
    }
  }
}
