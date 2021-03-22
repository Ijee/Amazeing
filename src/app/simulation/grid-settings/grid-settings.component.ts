import {Component, OnDestroy} from '@angular/core';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SettingsService} from '../../@core/services/settings.service';
import {SimulationService} from '../../@core/services/simulation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MazeService} from '../../@core/services/maze.service';
import {PathFindingService} from '../../@core/services/path-finding.service';
import {Subject} from 'rxjs';
import {fadeAnimationSafe} from '../../@shared/animations/fadeAnimation';

@Component({
  selector: 'app-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss'],
  animations: [fadeAnimationSafe]
})
export class GridSettingsComponent implements OnDestroy{
  public showWarning: boolean;

  private readonly destroyed$: Subject<void>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private library: FaIconLibrary,
              private mazeService: MazeService,
              private pathFindingService: PathFindingService,
              public simulationService: SimulationService,
              public settingsService: SettingsService) {
    library.addIconPacks(fas, fab, far);

    this.showWarning = false;
    // activates the right algorithm mode button based on the matched url
    if (this.router.url.includes('maze')) {
      this.settingsService.setAlgorithmMode('maze');
    } else {
      this.settingsService.setAlgorithmMode('path-finding');
    }

    this.destroyed$ = new Subject<void>();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * This switches to the other algorithm mode and handles the warning shown to the client
   *
   * @param algoMode - the new algorithm mode to be set
   * @param skipWarning - whether or not to skip the warning or not
   */
  public handleWarning(algoMode: string, skipWarning: boolean): void {
    if (this.settingsService.getAlgorithmMode() !== algoMode){
      if (this.settingsService.isWarningsSetting() && !skipWarning) {
        this.showWarning = true;
      } else {
        this.simulationService.prepareGrid();
        this.settingsService.setAlgorithmMode(algoMode);
        this.showWarning = false;
        let currentAlgorithm: string;
        if (this.settingsService.getAlgorithmMode() === 'maze') {
          currentAlgorithm = this.mazeService.getAlgorithmName();
        } else {
         currentAlgorithm = this.pathFindingService.getAlgorithmName();
        }
        console.log(currentAlgorithm);
        this.router.navigate([algoMode],
          {relativeTo: this.route, queryParams: {algorithm: currentAlgorithm}});
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

  /**
   * Navigates to the /learn route with the current selected algorithm as a query param.
   */
  public navigateToLearn(): void {
    let algoName: string;
    if (this.settingsService.getAlgorithmMode() === 'maze') {
      algoName = this.mazeService.getAlgorithmName();
    } else {
      algoName = this.pathFindingService.getAlgorithmName();
    }
    this.router.navigate(['/learn'], {queryParams: {algorithm: algoName}});
  }
}
