import {Component, Input} from '@angular/core';
import {SimulationService} from '../../../@core/services/simulation.service';
import {SettingsService} from '../../../@core/services/settings.service';
import {RecordService} from '../../../@core/services/record.service';
import {StatRecord} from '../../../../types';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  @Input('cell-count') cellCount: number;
  @Input('isMouseDown') isMouseDown: boolean;

  constructor(public simulationService: SimulationService,
              public recordService: RecordService,
              public settingsService: SettingsService) {
  }

  trackByName(index: number, item: StatRecord): string {
    return item.name;
  }
}
