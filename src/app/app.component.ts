import { AlgorithmMode } from './@core/types/algorithm.types';
import { environment } from '../environments/environment';
import { Component, HostListener, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faAdjust,
    faArrowUpRightFromSquare,
    faBackward,
    faBalanceScaleRight,
    faChalkboardTeacher,
    faCheck,
    faChevronRight,
    faCircleExclamation,
    faCog,
    faDownload,
    faExclamationTriangle,
    faFastForward,
    faFile,
    faFileImport,
    faForward,
    faInfo,
    faInfoCircle,
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
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { modalFadeInOut } from './@shared/animations/modalFadeInOut';
import { fadeRouteAnimation } from './@shared/animations/fadeRouteAnimation';
import { AlgorithmService } from './@core/services/algorithm.service';
import { UserTourService } from './@core/services/user-tour.service';
import { LegendModalComponent } from './@core/modals/legend/legend-modal.component';
import { ImportModalComponent } from './@core/modals/import-modal/import-modal.component';
import { ExportModalComponent } from './@core/modals/export-modal/export-modal.component';
import { CommonModule, DOCUMENT } from '@angular/common';
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
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        FontAwesomeModule,
        ClickOutsideDirective,
        LegendModalComponent,
        ImportModalComponent,
        ExportModalComponent
    ],
    animations: [modalFadeInOut, fadeRouteAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
    public version: string;
    public deferredInstallPrompt: any;
    public showNavbar: boolean;
    public showSettingsDropdown: boolean;
    public isBouncing: boolean;

    private readonly destroyed$: Subject<void>;

    constructor(
        library: FaIconLibrary,
        private readonly renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document,
        private readonly router: Router,
        private readonly userTourService: UserTourService,
        public readonly simulationService: SimulationService,
        public readonly settingsService: SettingsService,
        public readonly algorithmService: AlgorithmService,
        public readonly breakpointService: BreakpointService
    ) {
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
            faChevronRight
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
            if (event.key === 'ArrowRight') {
                if (!this.simulationService.getIsPlayDisabled()) {
                    this.simulationService.stepForward();
                }
            } else if (event.key === 'ArrowLeft') {
                this.simulationService.stepBackwards();
            } else if (event.code === 'Space') {
                if (!this.simulationService.getIsPlayDisabled()) {
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
        this.router.navigate(['/simulation']).then((value) => {
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

    /**
     * Is responsible for triggering the animation for the main routing
     *
     * @param outlet - the angular outlet to be used
     *
     * @return a boolean or an empty string that triggers the animation
     */
    public prepareRoute(outlet: RouterOutlet): any {
        return outlet.isActivated ? outlet.activatedRouteData.animationState : '';
    }

    public navigateToSimulation(): void {
        this.simulationService.setSimulationStatus(false);
        this.router.navigate(['simulation/' + this.algorithmService.getAlgorithmMode()]);
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
