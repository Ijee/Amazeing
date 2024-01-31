import { Component, OnInit } from '@angular/core';
import { fadeAnimationSafe } from '../@shared/animations/fadeRouteAnimation';
import { ControllerComponent } from './controller/controller.component';
import { GridSettingsComponent } from './grid-settings/grid-settings.component';
import { GridComponent } from './grid/grid.component';

@Component({
    selector: 'app-simulation',
    templateUrl: './simulation.component.html',
    styleUrls: ['./simulation.component.scss'],
    animations: [fadeAnimationSafe],
    standalone: true,
    imports: [GridComponent, GridSettingsComponent, ControllerComponent]
})
export class SimulationComponent {
    constructor() {}
}
