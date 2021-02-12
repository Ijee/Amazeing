import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../@core/services/settings.service';

@Component({
  selector: 'app-game',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
