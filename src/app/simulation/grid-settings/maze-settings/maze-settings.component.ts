import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../@core/services/settings.service';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import {MazeService} from '../../../@core/services/maze.service';

@Component({
  selector: 'app-maze-settings',
  templateUrl: './maze-settings.component.html',
  styleUrls: ['./maze-settings.component.scss']
})
export class MazeSettingsComponent implements OnInit {

  constructor(public settingsService: SettingsService, public mazeService: MazeService) {

  }

  ngOnInit(): void {
    // hljs.initHighlighting();
    hljs.registerLanguage('javascript', javascript);
  }
}
