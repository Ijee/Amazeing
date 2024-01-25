import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { SettingsService } from '../../@core/services/settings.service';
import { SimulationService } from '../../@core/services/simulation.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AlgorithmService } from '../../@core/services/algorithm.service';
import { Subject } from 'rxjs';
import { fadeAnimationSafe } from '../../@shared/animations/fadeRouteAnimation';
import { RecordService } from '../../@core/services/record.service';
import { AlgorithmMode } from '../../@core/types/algorithm.types';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { JsonFormControls, JsonFormData } from '../../@core/types/jsonform.types';

@Component({
    selector: 'app-grid-settings',
    templateUrl: './grid-settings.component.html',
    styleUrls: ['./grid-settings.component.scss'],
    animations: [fadeAnimationSafe]
})
export class GridSettingsComponent implements AfterViewInit, OnDestroy {
    public showWarning: boolean;
    public readonly optionsForm = this.formBuilder.group({});

    private readonly destroyed$: Subject<void>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ref: ChangeDetectorRef,
        private library: FaIconLibrary,
        private recordService: RecordService,
        public algorithmService: AlgorithmService,
        public simulationService: SimulationService,
        public settingsService: SettingsService,

        public formBuilder: UntypedFormBuilder
    ) {
        library.addIconPacks(fas, fab, far);

        this.showWarning = false;
        // activates the right algorithm mode button based on the matched url
        if (this.router.url.includes('maze')) {
            this.algorithmService.setAlgorithmMode('maze');
        } else {
            this.algorithmService.setAlgorithmMode('path-finding');
        }

        // Send changes to the current algorithm.
        this.optionsForm.valueChanges.subscribe(() => {
            this.setAlgorithmOptions();
        });

        this.simulationService.getPatchFormValues().subscribe((newValue) => {
            if (newValue) {
                for (const [key, value] of Object.entries(newValue)) {
                    this.optionsForm.controls[key].setValue(value, {
                        onlySelf: true
                    });
                }
            }
        });

        this.destroyed$ = new Subject<void>();
    }

    ngAfterViewInit() {
        // TODO Maybe fix following problem since Angular 16
        // Fixes ExpressionChangedAfterItHasBeenCheckedError for the loading animation.
        // Don't ask me why though.
        this.ref.detectChanges();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * This switches to the other algorithm mode and handles the warning shown to the client
     *
     * @param algoMode - the new algorithm mode to be set
     * @param skipWarning - whether or not to skip the warning or not
     */
    public handleWarning(algoMode: AlgorithmMode): void {
        if (this.algorithmService.getAlgorithmMode() !== algoMode) {
            if (
                this.recordService.getIteration() === 0 ||
                !this.settingsService.getWarningsSetting()
            ) {
                this.switchAlgoMode();
            } else {
                this.showWarning = true;
            }
        }
    }

    /**
     * Returns the other algoMode based on the one it is currently set to.
     */
    public switchAlgoMode(): void {
        this.showWarning = false;
        this.simulationService.setSimulationStatus(false);
        this.simulationService.prepareGrid();

        if (this.algorithmService.getAlgorithmMode() === 'maze') {
            this.algorithmService.setAlgorithmMode('path-finding');
        } else {
            this.algorithmService.setAlgorithmMode('maze');
        }

        this.router.navigate([this.algorithmService.getAlgorithmMode()], {
            relativeTo: this.route.parent,
            queryParams: {
                algorithm: this.algorithmService.getAlgorithmName()
            }
        });
    }

    /**
     * Navigates to the /learn route with the current selected algorithm as a query param.
     */
    public navigateToLearn(): void {
        this.router.navigate(['/learn'], {
            queryParams: { algorithm: this.algorithmService.getAlgorithmName() }
        });
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
        const jsonFormData = this.algorithmService.getJsonFormData();
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
