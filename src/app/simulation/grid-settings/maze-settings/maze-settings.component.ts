import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../@core/services/settings.service';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import {MazeAlgorithms} from '../../../../types';

@Component({
  selector: 'app-maze-settings',
  templateUrl: './maze-settings.component.html',
  styleUrls: ['./maze-settings.component.scss']
})
export class MazeSettingsComponent implements OnInit {
  public testCode: string;

  constructor(public settingsService: SettingsService) {
    this.testCode = `export model = new Model({
      a:1,
      b:function(){}
    })
    export model = new Model({
      a:1,
      b:function(){}
    })`;

  }

  ngOnInit(): void {
    // hljs.initHighlighting();
    hljs.registerLanguage('javascript', javascript);
  }
}
