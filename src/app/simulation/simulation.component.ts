import { Component } from '@angular/core';
import { fadeAnimationSafe } from '../@shared/animations/fadeRouteAnimation';
import { ControllerComponent } from './controller/controller.component';
import { GridSettingsComponent } from './grid-settings/grid-settings.component';
import { GridComponent } from './grid/grid.component';
import { BreakpointService } from '../@core/services/breakpoint.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-simulation',
    templateUrl: './simulation.component.html',
    styleUrls: ['./simulation.component.scss'],
    animations: [fadeAnimationSafe],
    standalone: true,
    imports: [CommonModule, GridComponent, GridSettingsComponent, ControllerComponent]
})
export class SimulationComponent {
    // TOOD: component paddings are messed up and need adjustments.
    // breakpointservice shouldn't be necessary
    constructor(public readonly breakpointService: BreakpointService) {}
}
