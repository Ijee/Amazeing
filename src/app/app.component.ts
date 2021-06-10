import {Component, HostListener, OnDestroy, OnInit, Renderer2} from '@angular/core';
import packageInfo from '../../package.json';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SimulationService} from './@core/services/simulation.service';
import {Subject} from 'rxjs';
import {SettingsService} from './@core/services/settings.service';
import {RouterOutlet} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {takeUntil} from 'rxjs/operators';
import {fadeInOut} from './@shared/animations/fadeInOut';
import {fadeRouteAnimation} from './@shared/animations/fadeRouteAnimation';
import {WarningDialogService} from './@shared/components/warning-modal/warning-dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInOut, fadeRouteAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
  public version: string;
  public isTouch: boolean;
  public isNavbar: boolean;
  public isSettingsDropdown: boolean;


  private readonly destroyed$: Subject<void>;

  constructor(library: FaIconLibrary,
              private renderer: Renderer2,
              private observer: BreakpointObserver,
              public simulationService: SimulationService,
              public settingsService: SettingsService,
              public warnDialogService: WarningDialogService) {
    this.version = packageInfo.version;
    library.addIconPacks(fas, fab, far);

    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.observer.observe('(max-width: 1023px)').pipe(takeUntil(this.destroyed$)).subscribe(result => {
      this.isTouch = result.matches;
      console.log('isTouch', this.isTouch);
    });

    this.renderer.addClass(document.body, 'dark-theme');
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
    if (event.code === 'ArrowRight') {
      this.simulationService.addIteration();
    } else if (event.code === 'ArrowLeft') {
      this.simulationService.setBackwardStep();
    } else if (event.code === 'Space') {
      this.simulationService.setSimulationStatus();
    } else if (event.code === 'NumpadAdd') {
      this.simulationService.setSpeedUp();
    } else if (event.code === 'NumpadSubtract') {
      this.simulationService.setSpeedDown();
    } else if (event.code === 'KeyR') {
      this.simulationService.reset();
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

  /**
   * Is responsible for triggering the animation for the main routing
   *
   * @param outlet - the angular outlet to be used
   *
   * @return a boolean or an empty string that triggers the animation
   */
  public prepareRoute(outlet: RouterOutlet): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
