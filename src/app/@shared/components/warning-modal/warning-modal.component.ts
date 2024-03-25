import { Component } from '@angular/core';
import { WarningDialogService } from './warning-dialog.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-warning-modal',
    templateUrl: './warning-modal.component.html',
    styleUrls: ['./warning-modal.component.scss'],
    standalone: true,
    imports: [FaIconComponent]
})
export class WarningModalComponent {
    constructor(public readonly warningDialog: WarningDialogService) {}
}
