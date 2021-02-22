import {Component, OnInit} from '@angular/core';
import hljs from 'highlight.js/lib/core';
import {SettingsService} from '../../../@core/services/settings.service';
import {PathFindingService} from '../../../@core/services/path-finding.service';

@Component({
  selector: 'app-pathfinding-settings',
  templateUrl: './pathfinding-settings.component.html',
  styleUrls: ['./pathfinding-settings.component.scss']
})
export class PathfindingSettingsComponent implements OnInit {

  constructor(public settingsService: SettingsService, public pathFindingService: PathFindingService) {
  }

  ngOnInit(): void {
    // deprecated? hljs.initHighlighting();
    hljs.highlightAll();
  }

}
