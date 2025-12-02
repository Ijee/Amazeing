import { BreakpointService } from './../../services/breakpoint.service';
import { Component, inject } from '@angular/core';
import { AlgorithmService } from '../../services/algorithm.service';
import { SimulationService } from '../../services/simulation.service';
import { NgClass, CommonModule } from '@angular/common';
import { HrComponent } from '../../../@shared/components/hr/hr.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-legend-modal',
    templateUrl: './legend-modal.component.html',
    styleUrls: ['./legend-modal.component.scss'],
    imports: [CommonModule, FaIconComponent, HrComponent, NgClass]
})
export class LegendModalComponent {
    protected readonly simulationService = inject(SimulationService);
    protected readonly algorithmService = inject(AlgorithmService);
    protected readonly breakpointService = inject(BreakpointService);
}
