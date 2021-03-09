import {Component, OnInit} from '@angular/core';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SettingsService} from '../../@core/services/settings.service';
import {SimulationService} from '../../@core/services/simulation.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss']
})
export class GridSettingsComponent implements OnInit {
  public showWarning: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private library: FaIconLibrary,
              public simulationService: SimulationService,
              public settingsService: SettingsService) {
    library.addIconPacks(fas, fab, far);

    this.showWarning = false;
  }

  ngOnInit(): void {
    const x = {
      a: 'a',
      b: 'b'
    };
    x.b = 'b';

  }

  /**
   * This switches to the other algorithm mode and handles the warning shown to the client
   *
   * @param algoMode - the new algorithm mode to be set
   * @param skipWarning - whether or not to skip the warning or not
   */
  public handleWarning(algoMode: string, skipWarning: boolean): void {
    if (this.settingsService.getAlgorithmMode() !== algoMode){
      if (this.settingsService.getWarningsSetting() && !skipWarning) {
        this.showWarning = true;
      } else {
        this.simulationService.softReset();
        this.settingsService.setAlgorithmMode(algoMode);
        this.showWarning = false;
        this.router.navigate([algoMode], {relativeTo: this.route});
        // console.log('algoMode in service', this.settingsService.getAlgorithmMode());
      }
    }
  }

  /**
   * Returns the other algoMode based on the one it is currently set to.
   */
  public switchToOtherMode(): string {
    return this.settingsService.getAlgorithmMode() === 'maze' ? 'path-finding' : 'maze';
  }
}
