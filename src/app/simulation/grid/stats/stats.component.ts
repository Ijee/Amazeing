import {Component, Input} from '@angular/core';
import {SimulationService} from '../../../@core/services/simulation.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  @Input('cell-count') cellCount: number;
  @Input('isMouseDown') isMouseDown: boolean;

  constructor(public simulationService: SimulationService) {
  }
}
