import {Component} from '@angular/core';
import {SimulationService} from '../../services/simulation.service';
import {modalAnimation} from '../../../@shared/animations/modalAnimation';

@Component({
  selector: 'app-legend-modal',
  templateUrl: './legend-modal.component.html',
  styleUrls: ['./legend-modal.component.scss'],
  animations: [modalAnimation]
})
export class LegendModalComponent {
  constructor(public simulationService: SimulationService) {}
}
