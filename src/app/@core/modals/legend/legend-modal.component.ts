import { Component } from '@angular/core';
import { AlgorithmService } from '../../services/algorithm.service';
import { SimulationService } from '../../services/simulation.service';
import { NgClass } from '@angular/common';
import { HrComponent } from '../../../@shared/components/hr/hr.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-legend-modal',
    templateUrl: './legend-modal.component.html',
    styleUrls: ['./legend-modal.component.scss'],
    standalone: true,
    imports: [FaIconComponent, HrComponent, NgClass]
})
export class LegendModalComponent {
    constructor(
        public readonly simulationService: SimulationService,
        public readonly algorithmService: AlgorithmService
    ) {}
}
