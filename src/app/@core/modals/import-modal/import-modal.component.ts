import {Component, OnDestroy, OnInit} from '@angular/core';
import {SimulationService} from '../../services/simulation.service';
import {take, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {Session} from '../../../../types';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss'],
})
export class ImportModalComponent implements OnInit, OnDestroy {
  public usedFileUpload: boolean;
  public fileName: string;
  public importToken: string;
  public importError: boolean;

  private readonly destroyed$: Subject<void>;

  constructor(public simulationService: SimulationService, library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
    this.fileName = 'No file selected...';
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
      this.importError = false;
    } catch (error) {
      this.importError = true;
      this.simulationService.reset();
    }
  }

  /**
   * Called when a file has been uploaded through the file explorer.
   *
   * @param event - the event that was being triggered.
   */
  uploadFile(event): void {
    const uploadedFile: File = event.target.files[0];
    this.importFromFile(uploadedFile);
  }

  /**
   * Called when a file has been dropped on the upload DOM element.
   * Only handles the first file that has been dragged in.
   * Check drop-zone directive for further reading.
   *
   * @param file - the new file that comes from the directive.
   */
  droppedInFile(file): void {
    this.importFromFile(file[0]);
  }

  importFromFile(newFile: File): void {
    try {
      this.usedFileUpload = true;
      const fileReader = new FileReader();
      this.fileName = newFile.name;
      fileReader.readAsText(newFile);
      fileReader.onloadend = (e) => {
        this.importToken = fileReader.result as string;
      };
      this.importError = false;
    } catch (error) {
      this.fileName = 'No file selected...';
      console.error('Could not upload file.', error);
    }
  }
}
