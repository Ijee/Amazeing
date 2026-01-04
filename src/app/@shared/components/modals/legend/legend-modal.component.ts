import { Component, inject } from '@angular/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { HrComponent } from './../../hr/hr.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SimulationService } from 'src/app/@core/services/simulation.service';
import { AlgorithmService } from 'src/app/@core/services/algorithm.service';
import { BreakpointService } from 'src/app/@core/services/breakpoint.service';

@Component({
    selector: 'app-legend-modal',
    templateUrl: './legend-modal.component.html',
    styleUrls: ['./legend-modal.component.scss'],
    imports: [FaIconComponent, HrComponent, NgClass, AsyncPipe, NgClass]
})
export class LegendModalComponent {
    protected readonly simulationService = inject(SimulationService);
    protected readonly algorithmService = inject(AlgorithmService);
    protected readonly breakpointService = inject(BreakpointService);
}
