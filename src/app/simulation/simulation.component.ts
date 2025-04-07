import { Component } from '@angular/core';
import { ControllerComponent } from './controller/controller.component';
import { GridSettingsComponent } from './grid-settings/grid-settings.component';
import { GridComponent } from './grid/grid.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-simulation',
    templateUrl: './simulation.component.html',
    styleUrls: ['./simulation.component.scss'],
    animations: [],
    imports: [CommonModule, GridComponent, GridSettingsComponent, ControllerComponent]
})
export class SimulationComponent {
    constructor() {}
}
