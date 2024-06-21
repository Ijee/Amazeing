import { CommonModule } from '@angular/common';
import { SimulationService } from '../../../@core/services/simulation.service';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { AlgorithmService } from 'src/app/@core/services/algorithm.service';
import { RecordService } from 'src/app/@core/services/record.service';
import { SettingsService } from 'src/app/@core/services/settings.service';
import { JsonFormControls, JsonFormData } from 'src/app/@core/types/jsonform.types';
import { DisableControlDirective } from 'src/app/@shared/directives/disable-control.directive';
import { Subject, takeUntil } from 'rxjs';
import { AlgorithmMode } from 'src/app/@core/types/algorithm.types';

@Component({
    selector: 'app-algorithm-options',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DisableControlDirective],
    templateUrl: './algorithm-options.component.html',
    styleUrl: './algorithm-options.component.scss'
})
export class AlgorithmOptionsComponent implements OnDestroy {
    @Input() algorithmMode: AlgorithmMode;
    public readonly optionsForm = this.formBuilder.group({});

    private readonly destroyed$: Subject<void>;
    constructor(
        public readonly algorithmService: AlgorithmService,
        public readonly simulationService: SimulationService,
        public readonly settingsService: SettingsService,
        public readonly recordService: RecordService,
        public readonly formBuilder: UntypedFormBuilder
    ) {
        this.destroyed$ = new Subject<void>();

        // Send changes to the current algorithm.
        this.optionsForm.valueChanges.subscribe(() => {
            this.setAlgorithmOptions();
        });

        this.simulationService
            .getPatchFormValues()
            .pipe(takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                if (newValue) {
                    for (const [key, value] of Object.entries(newValue)) {
                        this.optionsForm.controls[key].setValue(value, {
                            onlySelf: true
                        });
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    private createForm(controls: JsonFormControls[]) {
        for (const control of controls) {
            const validatorsToAdd = [];
            for (const [key, value] of Object.entries(control.validators)) {
                switch (key) {
                    case 'min':
                        validatorsToAdd.push(Validators.min(value));
                        break;
                    case 'max':
                        validatorsToAdd.push(Validators.max(value));
                        break;
                    case 'required':
                        if (value) {
                            validatorsToAdd.push(Validators.required);
                        }
                        break;
                    case 'requiredTrue':
                        if (value) {
                            validatorsToAdd.push(Validators.requiredTrue);
                        }
                        break;
                    case 'email':
                        if (value) {
                            validatorsToAdd.push(Validators.email);
                        }
                        break;
                    case 'minLength':
                        validatorsToAdd.push(Validators.minLength(value));
                        break;
                    case 'maxLength':
                        validatorsToAdd.push(Validators.maxLength(value));
                        break;
                    case 'pattern':
                        validatorsToAdd.push(Validators.pattern(value));
                        break;
                    case 'nullValidator':
                        if (value) {
                            validatorsToAdd.push(Validators.nullValidator);
                        }
                        break;
                    default:
                        break;
                }
            }
            this.optionsForm.addControl(
                control.name,
                this.formBuilder.control(control.value, validatorsToAdd)
            );
            // this.optionsForm.addControl(
            //     control.name,
            //     new FormControl(
            //         { value: [], disabled: this.recordService.getIteration() > 0 },
            //         (control1) => validatorsToAdd
            //     )
            // );
        }
    }

    /**
     * Gets and handles the creation of the form based on JsonFormData.
     */
    public handleJsonFormData(): JsonFormData {
        const jsonFormData = this.algorithmService.getJsonFormData(this.algorithmMode);
        this.createForm(jsonFormData.controls);
        return jsonFormData;
    }

    /**
     * Creates and sets the algorithm options for the current algorithm.
     */
    public setAlgorithmOptions(): void {
        const options = {};
        for (const field in this.optionsForm.controls) {
            // sets the value on the options obj also casts string boolean back to boolean
            this.optionsForm.controls[field].value === ('true' || 'false')
                ? (options[field] = JSON.parse(
                      this.optionsForm.controls[field].value.toLowerCase()
                  ))
                : (options[field] = this.optionsForm.controls[field].getRawValue());
        }
        // console.log(options);
        this.algorithmService.setOptions(options);
    }
}
