import { Component, OnInit } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import {SettingsService} from '../../../@core/services/settings.service';

@Component({
  selector: 'app-pathfinding-settings',
  templateUrl: './pathfinding-settings.component.html',
  styleUrls: ['./pathfinding-settings.component.scss']
})
export class PathfindingSettingsComponent implements OnInit {
  public testCode: string;

  constructor(public settingsService: SettingsService) {
    this.testCode = `
    export model = new Model({
      a:1,
      b:function(){}
    })
    export model = new Model({
      a:1,
      b:function(){}
    })
    `;
  }

  ngOnInit(): void {
    // deprecated? hljs.initHighlighting();
    hljs.highlightAll();
  }

}
