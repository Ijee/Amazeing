import { Component, OnInit } from '@angular/core';
import { fadeAnimationSafe } from '../@shared/animations/fadeRouteAnimation';

@Component({
    selector: 'app-simulation',
    templateUrl: './simulation.component.html',
    styleUrls: ['./simulation.component.scss'],
    animations: [fadeAnimationSafe]
})
export class SimulationComponent {
    constructor() {}
}
