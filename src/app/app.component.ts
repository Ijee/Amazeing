import { environment } from '../environments/environment';
import {
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    Renderer2,
    DOCUMENT,
    inject,
    signal
} from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faAdjust,
    faArrowUpRightFromSquare,
    faBackward,
    faBalanceScaleRight,
    faCalendarDays,
    faChalkboardTeacher,
    faCheck,
    faCircleExclamation,
    faCog,
    faDownload,
    faExclamationTriangle,
    faFastForward,
    faFile,
    faFileImport,
    faForward,
    faInfoCircle,
    faLink,
    faMicrochip,
    faPlay,
    faRedo,
    faShareNodes,
    faStepBackward,
    faStepForward,
    faStop,
    faTag,
    faTimes,
    faTimesCircle,
    faTrash,
    faTriangleExclamation,
    faWind
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEdit, faSave } from '@fortawesome/free-regular-svg-icons';
import { SimulationService } from './@core/services/simulation.service';
import { Subject } from 'rxjs';
import { SettingsService } from './@core/services/settings.service';
import { Router, RouterLinkActive, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { AlgorithmService } from './@core/services/algorithm.service';
import { UserTourService } from './@core/services/user-tour.service';
import { LegendModalComponent } from './@core/modals/legend/legend-modal.component';
import { ImportModalComponent } from './@core/modals/import-modal/import-modal.component';
import { ExportModalComponent } from './@core/modals/export-modal/export-modal.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { ClickOutsideDirective } from './@shared/directives/click-outside.directive';
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste';
import { faSquareFull } from '@fortawesome/free-solid-svg-icons/faSquareFull';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons/faWindowClose';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons/faCircleQuestion';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { BreakpointService } from './@core/services/breakpoint.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        RouterOutlet,
        RouterLinkActive,
        FontAwesomeModule,
        ClickOutsideDirective,
        LegendModalComponent,
        ImportModalComponent,
        ExportModalComponent,
        AsyncPipe,
        NgClass,
        RouterLinkWithHref
    ]
})
export class AppComponent implements OnInit, OnDestroy {
    private readonly renderer = inject(Renderer2);
    private readonly document = inject<Document>(DOCUMENT);
    private readonly router = inject(Router);
    private readonly userTourService = inject(UserTourService);
    protected readonly simulationService = inject(SimulationService);
    protected readonly settingsService = inject(SettingsService);
    protected readonly algorithmService = inject(AlgorithmService);
    protected readonly breakpointService = inject(BreakpointService);

    protected version: string;
    protected deferredInstallPrompt: any;
    protected showNavbar: boolean;
    protected showSettingsDropdown: boolean;
    protected isBouncing: boolean;

    protected routeTransition = signal<boolean>(true);

    private readonly destroyed$: Subject<void>;

    constructor() {
        const library = inject(FaIconLibrary);

        // Icon library which is globally available. Please check before removing icons.
        library.addIcons(
            // general
            faChalkboardTeacher,
            faCheck,
            faTimes,
            faInfoCircle,
            faSquareFull,
            // controller component
            faBackward,
            faStepBackward,
            faTrash,
            faRedo,
            faStop,
            faPlay,
            faStepForward,
            faFastForward,
            faForward,
            faEdit,
            faSave,
            // grid component
            faBalanceScaleRight,
            faEye,
            faEyeSlash,
            // grid-settings
            faCircleExclamation,
            // modals
            faPaste,
            faDownload,
            faShareNodes,
            faTimesCircle,
            faFileImport,
            faFile,
            faExclamationTriangle,
            faCheckSquare,
            faWindowClose,
            // app component
            faMicrochip,
            faCog,
            faAdjust,
            faWind,
            faGithub,
            faTriangleExclamation,
            faCircleQuestion,
            faTag,
            // learn
            faArrowUpRightFromSquare,
            faLink,
            faCalendarDays
        );
        this.version = environment.version;
        this.isBouncing = true;

        this.destroyed$ = new Subject<void>();
    }

    ngOnInit(): void {
        this.settingsService.getDarkModeSetting().subscribe((val) => {
            if (!document.startViewTransition) {
                this.switchTheme(val);
                return;
            }

            if (this.settingsService.getAnimationsSetting()) {
                this.document.startViewTransition(() => {
                    this.switchTheme(val);
                });
            } else {
                this.switchTheme(val);
            }
        });

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            this.deferredInstallPrompt = e;
            // // Update UI notify the user they can install the PWA
            // showInstallPromotion();
        });

        setTimeout(() => (this.isBouncing = false), 10000);
        setTimeout(() => this.routeTransition.set(false), 100);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     *  Global hotkeys for the app
     */
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (!this.settingsService.getUserTourActive()) {
            if (event.key === 'd') {
                if (!this.simulationService.getAlgorithmComplete()) {
                    this.simulationService.stepForward();
                }
            } else if (event.key === 'a') {
                this.simulationService.stepBackwards();
            } else if (event.key === 's') {
                if (!this.simulationService.getAlgorithmComplete()) {
                    this.simulationService.setSimulationStatus();
                }
            } else if (event.code === 'NumpadAdd' || event.key === '+') {
                this.simulationService.setSpeedUp();
            } else if (event.code === 'NumpadSubtract' || event.key === '-') {
                this.simulationService.setSpeedDown();
            } else if (event.key === 'r') {
                this.simulationService.reset();
            }
        }
    }

    private switchTheme(val: boolean): void {
        if (val) {
            this.renderer.removeClass(document.body, 'theme-light');
            this.renderer.addClass(document.body, 'theme-dark');
        } else {
            this.renderer.removeClass(document.body, 'theme-dark');
            this.renderer.addClass(document.body, 'theme-light');
        }
    }

    // /**
    //  * Fixes mobile viewport for mobile chrome, etc.
    //  * See: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    //  */
    // @HostListener('resize', ['$event'])
    // handleResizeEvent(): void {
    //   const vh = window.innerHeight * 0.01;
    //   document.documentElement.style.setProperty('--vh', `${vh}px`);
    // }

    public prepareUserTour(): void {
        this.router.navigate(['/simulation']).then(() => {
            this.showSettingsDropdown = false;
            this.settingsService.setUserTourTaken(true);
            this.settingsService.setUserTourActive(true);
            this.userTourService.startTour(this.settingsService.getAnimationsSetting());
        });
    }

    /**
     * Shows the native installation prompt to install the app as a PWA.
     */
    public async showInstallPrompt(): Promise<void> {
        // Show the installation prompt
        this.deferredInstallPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredInstallPrompt.userChoice;

        this.deferredInstallPrompt = null;
    }

    public navigateToSimulation(): void {
        this.simulationService.setSimulationStatus(false);
        const rootElement = this.document.documentElement;
        this.renderer.addClass(rootElement, 'no-root-view-transition');
        this.routeTransition.set(true);

        this.router
            .navigate(['simulation/' + this.algorithmService.getAlgorithmMode()], {
                queryParams: {
                    algorithm: this.algorithmService.getAlgorithmName()
                }
            })
            .finally(() => {
                setTimeout(() => {
                    this.renderer.removeClass(rootElement, 'no-root-view-transition');
                    this.routeTransition.set(false);
                }, 10);
            });
    }

    public navigateToLearn(): void {
        this.simulationService.setSimulationStatus(false);
        const rootElement = this.document.documentElement;
        this.renderer.addClass(rootElement, 'no-root-view-transition');
        this.routeTransition.set(true);

        this.router
            .navigate(['learn/'], {
                queryParams: {
                    algorithm: this.algorithmService.getAlgorithmName()
                }
            })
            .finally(() => {
                setTimeout(() => {
                    this.renderer.removeClass(rootElement, 'no-root-view-transition');
                    this.routeTransition.set(false);
                }, 10);
            });
    }

    public determineLogoClass(): string {
        const algorithmMode = this.algorithmService.getAlgorithmMode();
        if (algorithmMode === undefined) {
            return;
        } else if (algorithmMode === 'maze') {
            return 'maze-mode';
        } else {
            return 'path-mode';
        }
    }
}
