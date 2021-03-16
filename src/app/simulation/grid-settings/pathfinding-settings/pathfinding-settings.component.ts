import {Component, OnDestroy, OnInit} from '@angular/core';
import hljs from 'highlight.js/lib/core';
import {SettingsService} from '../../../@core/services/settings.service';
import {PathFindingService} from '../../../@core/services/path-finding.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PathFindingAlgorithm} from '../../../../types';

@Component({
  selector: 'app-pathfinding-settings',
  templateUrl: './pathfinding-settings.component.html',
  styleUrls: ['./pathfinding-settings.component.scss']
})
export class PathfindingSettingsComponent implements OnInit, OnDestroy {
  private readonly destroyed$: Subject<void>;


  constructor(private route: ActivatedRoute,
              private router: Router,
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
   * Handles appending the query param to the url and switching the algorithm based on click.
   *
   * @param newAlgorithm - the new algorithm to be set
   */
  public handleAlgorithmChange(newAlgorithm: PathFindingAlgorithm): void {
    this.pathFindingService.switchAlgorithm(newAlgorithm);
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {algorithm: newAlgorithm},
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
}


