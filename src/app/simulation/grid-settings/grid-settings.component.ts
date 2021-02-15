import {Component, OnInit} from '@angular/core';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SettingsService} from '../../@core/services/settings.service';
import {SimulationService} from '../../@core/services/simulation.service';

@Component({
  selector: 'app-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss']
})
export class GridSettingsComponent implements OnInit {
  public showWarning: boolean;

  constructor(private library: FaIconLibrary,
              public simulationService: SimulationService,
              public settingsService: SettingsService) {
    library.addIconPacks(fas, fab, far);

    this.showWarning = false;
  }

  ngOnInit(): void {
  }

  public handleWarning(algoMode: string, skipWarning: boolean): void {
    if (this.settingsService.getWarningsSetting() && !skipWarning) {
      this.showWarning = true;
    } else {
      // so that it does not reset twice when going back and forth betweeen the modes
      if (this.simulationService.getGridSavePoint().length > 0) {
        this.simulationService.reset();
      }
      this.settingsService.setAlgorithmMode(algoMode);
      // console.log('algoMode in service', this.settingsService.getAlgorithmMode());
      this.showWarning = false;
    }
  }

  /**
   * this switches to the other algorithm mode
   * I am aware that it could have been a boolean but I could not find a variable name
   * that fits and makes sense when you skim over it for the other parts of the app when checking for it.
   *
   */
  public switchtoOtherMode(): string {
    return this.settingsService.getAlgorithmMode() === 'maze' ? 'pathFinding' : 'maze';
  }
}
