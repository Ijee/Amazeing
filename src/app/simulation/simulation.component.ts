import { Component, OnInit } from '@angular/core';
import {fadeAnimationSafe} from '../@shared/animations/fadeAnimation';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss'],
  animations: [fadeAnimationSafe]
})
export class SimulationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
