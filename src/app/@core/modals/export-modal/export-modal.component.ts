import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SimulationService } from '../../services/simulation.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { BreakpointService } from '../../services/breakpoint.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-export-modal',
    templateUrl: './export-modal.component.html',
    styleUrls: ['./export-modal.component.scss'],
    imports: [CommonModule, FaIconComponent, FormsModule]
})
export class ExportModalComponent implements OnInit, OnDestroy {
    public canShare: boolean;

    private readonly destroyed$: Subject<void>;

    constructor(
        public readonly simulationService: SimulationService,
        public readonly breakpointService: BreakpointService
    ) {
        this.destroyed$ = new Subject<void>();
    }

    ngOnInit() {
        this.canShare = !!navigator.share;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * Selects the HTMLTextArea on click.
     *
     * Note: Has to be a function because the target has to be cast
     * to the proper type and that can not be done in the template.
     *
     * @param target the target to focus
     */
    focusTextArea(target: EventTarget): void {
        const input = target as HTMLTextAreaElement;
        input.select();
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
     * Prepares the file to be used to either download or share:
     *
     * @return the exportBlob and fileName to use.
     */
    prepareFile(): [exportBlob: Blob, fileName: string] {
        const exportToken = this.simulationService.getExportToken().toString();
        const algorithmName = this.simulationService.getAlgorithmName().toLowerCase();
        const currentTime = new Date().toISOString().split('T')[0];
        const fileName = `amazeing_${algorithmName}_${currentTime}.txt`;
        const exportBlob = new Blob([exportToken], {
            type: 'application/octet-stream'
        });
        return [exportBlob, fileName];
    }

    /**
     * Hides the modal from the client
     * and tries to download the export token as a file.
     */
    exportAsFile(): void {
        try {
            const [exportBlob, fileName] = this.prepareFile();
            saveAs(exportBlob, fileName);
            this.simulationService.toggleShowExportModal();
        } catch (error) {
            console.error(
                'Could not download file. Please check if your browser is blocking downloads. ' +
                    error
            );
        }
    }

    /**
     * Tries to share the file with the OS native share functionality.
     */
    async shareFile(): Promise<void> {
        const [exportBlob, fileName] = this.prepareFile();
        const filesArray = [];
        filesArray.push(new File([exportBlob], fileName, { type: 'text/plain' }));
        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
            await navigator
                .share({
                    files: filesArray,
                    title: 'Amazeing - ' + this.simulationService.getAlgorithmName(),
                    text: 'Check out this algorithm on amazething.netlify.app!',
                    url: 'https://amazething.netlify.app/'
                })
                .then(() => console.log('Share was successful.'))
                .catch((error) => console.log('Sharing failed', error));
        } else {
            console.log(`Your system doesn't support sharing files.`);
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
        const type = 'text/plain';
        const exportToken = this.simulationService.getExportToken().toString();
        const blob = new Blob([exportToken], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        document.execCommand('copy');
        navigator.permissions
            .query({ name: 'clipboard-write' as PermissionName })
            .then((result) => {
                if (result.state === 'granted' || result.state === 'prompt') {
                    navigator.clipboard.write(data).then(() => {
                        console.info('Yee-ha copying worked...');
                    });
                }
            });
    }
}
