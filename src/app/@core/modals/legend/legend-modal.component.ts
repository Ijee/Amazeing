import { Component } from '@angular/core';
import { AlgorithmService } from '../../services/algorithm.service';
import { SimulationService } from '../../services/simulation.service';

@Component({
    selector: 'app-legend-modal',
    templateUrl: './legend-modal.component.html',
    styleUrls: ['./legend-modal.component.scss']
})
export class LegendModalComponent {
    constructor(
        public readonly simulationService: SimulationService,
        public readonly algorithmService: AlgorithmService
    ) {}
}
