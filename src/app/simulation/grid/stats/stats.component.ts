import {Component, Input} from '@angular/core';
import {SimulationService} from '../../../@core/services/simulation.service';
import {SettingsService} from '../../../@core/services/settings.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  @Input('cell-count') cellCount: number;
  @Input('isMouseDown') isMouseDown: boolean;

  constructor(public simulationService: SimulationService, public settingsService: SettingsService) {
  }
}
