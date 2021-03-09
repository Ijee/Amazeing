import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../@core/services/settings.service';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import {MazeService} from '../../../@core/services/maze.service';
import {MazeAlgorithms} from '../../../../types';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-maze-settings',
  templateUrl: './maze-settings.component.html',
  styleUrls: ['./maze-settings.component.scss']
})
export class MazeSettingsComponent implements OnInit {

  constructor(public settingsService: SettingsService,
              public mazeService: MazeService,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit(): void {
    // hljs.initHighlighting();
    // hljs.registerLanguage('javascript', javascript);
  }

  public handleALgorithmChange(newAlgorithm: MazeAlgorithms): void {
    this.mazeService.switchAlgorithm(newAlgorithm);
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { algorithm: newAlgorithm },
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
}
