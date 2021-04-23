import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SimulationService} from '../../../@core/services/simulation.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {
  @Input() status: number;
  @Input() weight: number;
  @Input('is-mouse-down') isMouseDown: boolean;
  @Output() wasUpdated: EventEmitter<void>;

  constructor(private simulationService: SimulationService) {
    this.wasUpdated = new EventEmitter<void>();
  }

  getWeight(): number {
    return this.simulationService.getShowWeightStatus() &&
    this.status !== 0 && this.status !== 1 && this.status !== 2 ? this.weight : undefined;
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
        // TODO make all node.status + 1 accross the whole app - see grid component status -2 as the reason
        return 'status-1';
      case 1:
        // start
        return 'has-background-primary';
      case 2:
        // goal
        return 'has-background-danger';
      case 3:
        return 'status-3';
      case 4:
        return 'status-4';
      case 5:
        return 'status-5';
      case 6:
        return 'status-6';
      case 7:
        return 'status-7';
      default:
        return 'none';
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
