import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import packageInfo from '../../package.json';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faAdjust,
    faBackward,
    faBalanceScaleRight,
    faChalkboardTeacher,
    faCheck,
    faCog,
    faDownload,
    faExclamationTriangle,
    faFastForward,
    faFileImport,
    faForward,
    faInfo,
    faInfoCircle,
    faMicrochip,
    faPlay,
    faRedo,
    faStepBackward,
    faStepForward,
    faStop,
    faTag,
    faTimes,
    faTrash,
    faTriangleExclamation,
    faWind
} from '@fortawesome/free-solid-svg-icons';
import { fab, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEdit, far, faSave, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { SimulationService } from './@core/services/simulation.service';
import { Subject } from 'rxjs';
import { SettingsService } from './@core/services/settings.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { modalFadeInOut } from './@shared/animations/modalFadeInOut';
import { fadeRouteAnimation } from './@shared/animations/fadeRouteAnimation';
import { WarningDialogService } from './@shared/components/warning-modal/warning-dialog.service';
import { AlgorithmService } from './@core/services/algorithm.service';
import { UserTourService } from './@core/services/user-tour.service';
import { WarningModalComponent } from './@shared/components/warning-modal/warning-modal.component';
import { LegendModalComponent } from './@core/modals/legend/legend-modal.component';
import { ImportModalComponent } from './@core/modals/import-modal/import-modal.component';
import { ExportModalComponent } from './@core/modals/export-modal/export-modal.component';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from './@shared/directives/click-outside.directive';
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';
import { faSquareFull } from '@fortawesome/free-solid-svg-icons/faSquareFull';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons/faWindowClose';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons/faCircleQuestion';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        FontAwesomeModule,
        ClickOutsideDirective,
        WarningModalComponent,
        LegendModalComponent,
        ImportModalComponent,
        ExportModalComponent
    ],
    animations: [modalFadeInOut, fadeRouteAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
    public version: string;
    public isTouch: boolean;
    public showNavbar: boolean;
    public showSettingsDropdown: boolean;
    public isBouncing: boolean;

    private readonly destroyed$: Subject<void>;

    constructor(
        library: FaIconLibrary,
        private readonly renderer: Renderer2,
        private readonly observer: BreakpointObserver,
        private readonly router: Router,
        private readonly userTourService: UserTourService,
        public readonly simulationService: SimulationService,
        public readonly settingsService: SettingsService,
        public readonly algorithmService: AlgorithmService,
        public readonly warnDialogService: WarningDialogService
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
            // modals
            faPaste,
            faDownload,
            faTimesCircle,
            faUpload,
            faFileImport,
            faInfo,
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
            faTag
        );
        this.version = packageInfo.version;
        this.isBouncing = true;

        this.destroyed$ = new Subject<void>();
    }

    ngOnInit(): void {
        this.observer
            .observe('(max-width: 1023px)')
            .pipe(takeUntil(this.destroyed$))
            .subscribe((result) => {
                this.isTouch = result.matches;
            });

        this.settingsService.getDarkModeSetting().subscribe((val) => {
            if (val) {
                this.renderer.removeClass(document.body, 'theme-light');
                this.renderer.addClass(document.body, 'theme-dark');
            } else {
                this.renderer.removeClass(document.body, 'theme-dark');
                this.renderer.addClass(document.body, 'theme-light');
            }
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
            if (event.code === 'ArrowRight') {
                if (!this.simulationService.getIsPlayDisabled()) {
                    this.simulationService.stepForward();
                }
            } else if (event.code === 'ArrowLeft') {
                this.simulationService.stepBackwards();
            } else if (event.code === 'Space') {
                if (!this.simulationService.getIsPlayDisabled()) {
                    this.simulationService.setSimulationStatus();
                }
            } else if (event.code === 'NumpadAdd') {
                this.simulationService.setSpeedUp();
            } else if (event.code === 'NumpadSubtract') {
                this.simulationService.setSpeedDown();
            } else if (event.code === 'KeyR') {
                this.simulationService.reset();
            }
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
            this.settingsService.setUserTourTaken(true);
            this.settingsService.setUserTourActive(true);
            this.userTourService.startTour();
        });
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
}
