import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameService} from '../services/game.service';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent {

  constructor(public gameService: GameService,
              private library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
  }
}
