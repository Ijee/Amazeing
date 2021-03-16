import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../@core/services/settings.service';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import {MazeService} from '../../../@core/services/maze.service';
import {MazeAlgorithm, PathFindingAlgorithm} from '../../../../types';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-maze-settings',
  templateUrl: './maze-settings.component.html',
  styleUrls: ['./maze-settings.component.scss']
})
export class MazeSettingsComponent implements OnInit {
  private readonly destroyed$: Subject<void>;

  constructor(private route: ActivatedRoute,
              private router: Router,
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

  public handleAlgorithmChange(newAlgorithm: MazeAlgorithm): void {
    this.mazeService.switchAlgorithm(newAlgorithm);
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {algorithm: newAlgorithm},
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
}
