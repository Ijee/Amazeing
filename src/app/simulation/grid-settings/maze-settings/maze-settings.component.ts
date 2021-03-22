import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from '../../../@core/services/settings.service';
import {MazeService} from '../../../@core/services/maze.service';
import {MazeAlgorithm} from '../../../../types';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {WarningDialogService} from '../../../@shared/components/warning-modal/warning-dialog.service';
import {SimulationService} from '../../../@core/services/simulation.service';

@Component({
  selector: 'app-maze-settings',
  templateUrl: './maze-settings.component.html',
  styleUrls: ['./maze-settings.component.scss']
})
export class MazeSettingsComponent implements OnInit, OnDestroy {
  private readonly destroyed$: Subject<void>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private warningDialog: WarningDialogService,
              public simulationService: SimulationService,
              public settingsService: SettingsService,
              public mazeService: MazeService) {
    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      const pathFindingAlgorithms = new Set<MazeAlgorithm>(['Prims', 'Kruskals', 'Aldous-Broder',
        'Wilsons', 'Ellers', 'Sidewinder', 'Hunt-and-Kill', 'Growing-Tree', 'Binary-Tree', 'Recursive-Backtracker',
        'Recursive-Division', 'Cellular-Automation', 'Wall-Follower', 'Pledge', 'Trémaux', 'Recursive',
        'Dead-End-Filling', 'Maze-Routing']);
      if (pathFindingAlgorithms.has(params.algorithm)) {
        this.mazeService.switchAlgorithm(params.algorithm);
      } else {
        this.router.navigate(['.'],
          {relativeTo: this.route, queryParams: {algorithm: this.mazeService.getAlgorithmName()}});
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public handleWarning(newAlgorithm: MazeAlgorithm): void {
    if (this.settingsService.isWarningsSetting()) {
      this.warningDialog.openDialog();
      this.warningDialog.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(result => {
        if (result === 'continue') {
          this.handleAlgorithmSwitch(newAlgorithm);
        } else {
          return;
        }
      });
    } else {
      this.handleAlgorithmSwitch(newAlgorithm);
    }
  }

  /**
   * Switches the algorithm and appends the query param to the url.
   *
   * @param newAlgorithm - the new algorithm to be set
   */
  private handleAlgorithmSwitch(newAlgorithm: MazeAlgorithm): void {
    this.mazeService.switchAlgorithm(newAlgorithm);
    // TODO soft reset or hard reset / grid savepoint?
    this.simulationService.prepareGrid();
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {algorithm: newAlgorithm},
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
}
