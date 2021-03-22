import {Component, OnDestroy, OnInit} from '@angular/core';
import hljs from 'highlight.js/lib/core';
import {SettingsService} from '../../../@core/services/settings.service';
import {PathFindingService} from '../../../@core/services/path-finding.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PathFindingAlgorithm} from '../../../../types';
import {WarningDialogService} from '../../../@shared/components/warning-modal/warning-dialog.service';
import {SimulationService} from '../../../@core/services/simulation.service';

@Component({
  selector: 'app-pathfinding-settings',
  templateUrl: './pathfinding-settings.component.html',
  styleUrls: ['./pathfinding-settings.component.scss']
})
export class PathfindingSettingsComponent implements OnInit, OnDestroy {
  private readonly destroyed$: Subject<void>;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private warningDialog: WarningDialogService,
              public simulationService: SimulationService,
              public settingsService: SettingsService,
              public pathFindingService: PathFindingService) {
    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      const pathFindingAlgorithms = new Set<PathFindingAlgorithm>(['A-Star',
        'IDA-Star', 'Dijkstra', 'Breadth-FS', 'Depth-FS', 'Best-FS', 'Trace', 'Jump-PS', 'Orthogonal-Jump-PS']);
      if (pathFindingAlgorithms.has(params.algorithm)) {
        this.pathFindingService.switchAlgorithm(params.algorithm);
      } else {
        this.router.navigate(['.'],
          {relativeTo: this.route, queryParams: {algorithm: this.pathFindingService.getAlgorithmName()}});
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Handles the warning settings the user set and delegates the correct action accordingly.
   *
   * @param newAlgorithm - the new algorithm to be set
   */
  public handleWarning(newAlgorithm: PathFindingAlgorithm): void {
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
  private handleAlgorithmSwitch(newAlgorithm: PathFindingAlgorithm): void {
    this.pathFindingService.switchAlgorithm(newAlgorithm);
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


