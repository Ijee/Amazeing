import {Component, OnDestroy, OnInit} from '@angular/core';
import {SimulationService} from '../../services/simulation.service';
import {take, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {modalAnimation} from '../../../@shared/animations/modalAnimation';
import {Session} from '../../../../types';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss'],
  animations: [modalAnimation]
})
export class ImportModalComponent implements OnInit, OnDestroy {
  public importToken: Session;
  public importError: boolean;

  private readonly destroyed$: Subject<void>;

  constructor(public simulationService: SimulationService, library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
    this.importError = false;

    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Hides the modal from the client
   * and uses the gameService for the grid to react to it
   */
  importSession(): void {
    this.simulationService.reset();
    try {
      this.simulationService.importSession(this.importToken);
      this.simulationService.toggleShowImportModal();
      this.importError = false;
    } catch (error) {
      this.importError = true;
      this.simulationService.reset();
    }
  }
}
