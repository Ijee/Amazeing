import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SimulationService } from '../../../@core/services/simulation.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class NodeComponent {
    @Input() status: number;
    @Input() weight: number;
    @Input() text: string;
    @Input() isMouseDown: boolean;
    @Output() wasUpdated: EventEmitter<void>;

    constructor(private simulationService: SimulationService) {
        this.wasUpdated = new EventEmitter<void>();
    }

    getText(): string {
        if (this.status !== 1) {
            if (!this.simulationService.getShowWeightStatus()) {
                return this.text;
            } else if (this.status !== 2 && this.status !== 3) {
                return this.weight?.toString();
            }
        }
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
                return 'start has-background-primary';
            case 3:
                // goal
                return 'goal has-background-danger';
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
     * Checks whether the cell should be reborn
     * as in negates the isAlive property
     *
     */
    setNewStatus(bool: boolean): void {
        if (bool) {
            this.wasUpdated.emit();
        }
    }
}
