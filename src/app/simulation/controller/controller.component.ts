import {Component} from '@angular/core';
import {SimulationService} from '../../@core/services/simulation.service';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {RecordService} from '../../@core/services/record.service';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent {

  constructor(public simulationService: SimulationService,
              public recordService: RecordService,
              private library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
  }
}
