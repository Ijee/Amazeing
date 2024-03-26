import { Component } from '@angular/core';
import { SimulationService } from '../../@core/services/simulation.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RecordService } from '../../@core/services/record.service';
import { MaxNumberPipe } from '../../@shared/pipes/max-number.pipe';
import { NgClass } from '@angular/common';
import { HrComponent } from '../../@shared/components/hr/hr.component';

@Component({
    selector: 'app-controller',
    templateUrl: './controller.component.html',
    styleUrls: ['./controller.component.scss'],
    standalone: true,
    imports: [HrComponent, FaIconComponent, NgClass, MaxNumberPipe]
})
export class ControllerComponent {
    constructor(
        public readonly simulationService: SimulationService,
        public readonly recordService: RecordService
    ) {}

    /**
     * Delegates the logic when trying to open the export modal.
     */
    public handleExportLogic(): void {
        this.simulationService.exportSession();
        this.simulationService.toggleShowExportModal();
        this.simulationService.setSimulationStatus(false);
    }
}
