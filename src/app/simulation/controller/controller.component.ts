import { Component } from '@angular/core';
import { SimulationService } from '../../@core/services/simulation.service';
import { FaIconLibrary, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
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
        public simulationService: SimulationService,
        public recordService: RecordService,
        private library: FaIconLibrary
    ) {
        library.addIconPacks(fas, fab, far);
    }

    public handleExportLogic(): void {
        this.simulationService.exportSession();
        this.simulationService.toggleShowExportModal();
        this.simulationService.setSimulationStatus(false);
    }
}
