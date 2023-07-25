import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '../../../@core/services/settings.service';
import { AlgorithmService } from '../../../@core/services/algorithm.service';
import { JsonFormControls, JsonFormData, MazeAlgorithm } from '../../../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WarningDialogService } from '../../../@shared/components/warning-modal/warning-dialog.service';
import { SimulationService } from '../../../@core/services/simulation.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { RecordService } from '../../../@core/services/record.service';
import { forEach } from 'lodash';

@Component({
    selector: 'app-maze-settings',
    templateUrl: './maze-settings.component.html',
    styleUrls: ['./maze-settings.component.scss']
})
export class MazeSettingsComponent implements OnInit, OnDestroy {
    public readonly optionsForm = this.formBuilder.group({});

    private readonly destroyed$: Subject<void>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        private warningDialog: WarningDialogService,
        public recordService: RecordService,
        public simulationService: SimulationService,
        public settingsService: SettingsService,
        public algorithmService: AlgorithmService,
        public formBuilder: UntypedFormBuilder
    ) {
        this.destroyed$ = new Subject<void>();
    }

    ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
            const pathFindingAlgorithms = new Set<MazeAlgorithm>([
                'Prims',
                'Kruskals',
                'Aldous-Broder',
                'Wilsons',
                'Ellers',
                'Sidewinder',
                'Hunt-and-Kill',
                'Growing-Tree',
                'Binary-Tree',
                'Recursive-Backtracking',
                'Recursive-Division',
                'Cellular-Automation',
                'Wall-Follower',
                'Pledge',
                'Trémaux',
                'Recursive',
                'Dead-End-Filling',
                'Maze-Routing'
            ]);
            if (pathFindingAlgorithms.has(params.algorithm)) {
                this.algorithmService.setMazeAlgorithm(params.algorithm);
            } else {
                this.router
                    .navigate(['.'], {
                        relativeTo: this.route,
                        queryParams: {
                            algorithm: this.algorithmService.getAlgorithmName()
                        }
                    })
                    .then(() => {
                        this.changeDetector.detectChanges();
                    });
            }
        });
        // this.optionsForm.valueChanges.subscribe(() => {
        //   if (this.recordService.getIteration() > 0) {
        //     for (let field in this.optionsForm.controls) {
        //       const control = this.optionsForm.get(field);
        //       control.disable();
        //     }
        //   }
        //   this.setAlgorithmOptions();
        // });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public handleWarning(newAlgorithm: MazeAlgorithm): void {
        if (this.recordService.getIteration() !== 0 && this.settingsService.getWarningsSetting()) {
            this.warningDialog.openDialog();
            this.warningDialog
                .afterClosed()
                .pipe(takeUntil(this.destroyed$))
                .subscribe((result) => {
                    if (result === 'continue') {
                        this.handleAlgorithmSwitch(newAlgorithm);
                    } else {
                        return;
                    }
                });
        } else {
            this.handleAlgorithmSwitch(newAlgorithm);
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
                : (options[field] = this.optionsForm.controls[field].value);
        }
        this.algorithmService.setOptions(options);
    }

    /**
     * Switches the algorithm and appends the query param to the url.
     *
     * @param newAlgorithm - the new algorithm to be set
     */
    private handleAlgorithmSwitch(newAlgorithm: MazeAlgorithm): void {
        this.algorithmService.setMazeAlgorithm(newAlgorithm);
        // TODO soft reset or hard reset / grid savepoint?
        this.simulationService.prepareGrid();
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { algorithm: newAlgorithm },
            queryParamsHandling: 'merge' // remove to replace all query params by provided
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
        }
    }

    protected readonly SimulationService = SimulationService;
}
