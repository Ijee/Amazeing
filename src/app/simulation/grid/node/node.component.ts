import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SimulationService } from '../../../@core/services/simulation.service';

@Component({
    selector: 'app-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.scss']
})
export class NodeComponent {
    @Input() status: number;
    @Input() weight: number;
    @Input() isMouseDown: boolean;
    @Output() wasUpdated: EventEmitter<void>;

    constructor(private simulationService: SimulationService) {
        this.wasUpdated = new EventEmitter<void>();
    }

    getWeight(): number {
        return this.simulationService.getShowWeightStatus() &&
            this.status !== 1 &&
            this.status !== 2 &&
            this.status !== 3 &&
            this.weight !== null
            ? this.weight
            : undefined;
    }

    getNodeClasses(): string {
        const first = this.determineStatus();
        const second = this.determineDrawMode();
        return second ? first + ' ' + second : first;
    }

    determineDrawMode(): string {
        switch (this.simulationService.getDrawingMode()) {
            case 2:
                return 'start';
            case 3:
                return 'goal';
        }
    }

    /**
     * Determines the class that has to be set for the cell
     * to get its proper styling
     *
     * See src/styles/colors for the color meaning when given.
     */
    determineStatus(): string {
        switch (this.status) {
            case 1:
                return 'status-1';
            case 2:
                // start
                return 'has-background-primary';
            case 3:
                // goal
                return 'has-background-danger';
            case 4:
                return 'status-4';
            case 5:
                return 'status-5';
            case 6:
                return 'status-6';
            case 7:
                return 'status-7';
            case 8:
                return 'status-8';
            case 9:
                return 'status-9';
            default:
                return 'none';
        }
    }

    /**
     * Checks whether or not the cell should be reborn
     * as in negates the isAlive property
     *
     */
    setNewStatus(bool: boolean): void {
        if (bool) {
            this.wasUpdated.emit();
        }
    }
}
