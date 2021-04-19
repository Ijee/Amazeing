import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {SimulationService} from '../../services/simulation.service';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {modalAnimation} from '../../../@shared/animations/modalAnimation';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss'],
  animations: [modalAnimation]
})
export class ExportModalComponent implements OnDestroy {

  private readonly destroyed$: Subject<void>;

  constructor(public simulationService: SimulationService, library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);

    this.destroyed$ = new Subject<void>();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Hides the modal from the client
   * and tries to copy the export token with the function below
   */
  exportSession(): void {
    this.toClipboard();
    this.simulationService.toggleShowExportModal();
  }

  /**
   * Hides the modal froom the client
   * and tries to download the export token as a file.
   */
  exportAsFile(): void {
    try {
      const exportToken = this.simulationService.getExportToken().toString();
      const algorithmName = this.simulationService.getAlgorithmName().toLowerCase();
      const currentTime = new Date().toISOString().split('T')[0];
      const fileName = `amazeing_${algorithmName}_${currentTime}.txt`;
      const exportBlob = new Blob([exportToken], {type: 'application/octet-stream'});
      saveAs(exportBlob, fileName);
      this.simulationService.toggleShowExportModal();
    } catch (error) {
      console.error('Could not download file. Please check if your browser is blocking downloads.');
    }
  }

  /**
   * Copies the text in the #copystring input
   * to the users clipboard. May not work for
   * some clients.
   */
  toClipboard(): void {
    const copyString = document.querySelector('#exportArea') as HTMLTextAreaElement;
    copyString.select();
    document.execCommand('copy');
  }
}
