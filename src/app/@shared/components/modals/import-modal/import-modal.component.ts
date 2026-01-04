import { Component, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrComponent } from '../../hr/hr.component';
import { DropZoneDirective } from 'src/app/@shared/directives/drop-zone.directive';
import { SimulationService } from 'src/app/@core/services/simulation.service';
import { BreakpointService } from 'src/app/@core/services/breakpoint.service';

@Component({
    selector: 'app-import-modal',
    templateUrl: './import-modal.component.html',
    styleUrls: ['./import-modal.component.scss'],
    imports: [FaIconComponent, FormsModule, HrComponent, DropZoneDirective, AsyncPipe, NgClass]
})
export class ImportModalComponent implements OnDestroy {
    protected readonly simulationService = inject(SimulationService);
    protected readonly breakpointService = inject(BreakpointService);

    protected usedFileUpload: boolean;
    protected fileName: string;
    protected importToken: string;
    protected importError: boolean;

    private readonly destroyed$: Subject<void>;

    constructor() {
        this.fileName = 'No file selected...';
        this.importError = false;
        this.importToken = '';
        this.destroyed$ = new Subject<void>();
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
            console.error('Could not import.', error);
        }
    }

    /**
     * Called when a file has been uploaded through the file explorer.
     *
     * @param event the event that was being triggered.
     */
    uploadFile(event: Event): void {
        const uploadedFile: File = (event.target as HTMLInputElement).files[0];
        this.importFromFile(uploadedFile);
    }

    /**
     * Called when a file has been dropped on the upload DOM element.
     * Only handles the first file that has been dragged in.
     * Check drop-zone directive for further reading.
     *
     * @param file the new file that comes from the directive.
     */
    droppedInFile(file: File): void {
        this.importFromFile(file[0]);
    }

    importFromFile(newFile: File): void {
        try {
            this.usedFileUpload = true;
            const fileReader = new FileReader();
            this.fileName = newFile.name;
            fileReader.readAsText(newFile);
            fileReader.onloadend = () => {
                this.importToken = fileReader.result as string;
            };
            this.importError = false;
        } catch (error) {
            this.fileName = 'No file selected...';
            console.error('Could not upload file.', error);
        }
    }
}
