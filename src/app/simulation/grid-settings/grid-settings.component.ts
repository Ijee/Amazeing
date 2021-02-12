import {Component, OnInit} from '@angular/core';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SettingsService} from '../../@core/services/settings.service';

@Component({
  selector: 'app-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss']
})
export class GridSettingsComponent implements OnInit {

  constructor(private library: FaIconLibrary, public settingsService: SettingsService) {
    library.addIconPacks(fas, fab, far);
  }

  ngOnInit(): void {
  }

}
