import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SimulationService} from './@core/services/simulation.service';
import {fadeAnimation} from './@shared/animations/fadeAnimation';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {SettingsService} from './@core/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
  public isNavbar: boolean;
  public isSettingsDropdown: boolean;
  public isLegend: boolean;



  private readonly destroyed$: Subject<void>;

  constructor(library: FaIconLibrary,
              public simulationService: SimulationService,
              public settingsService: SettingsService,
              private router: Router,
              private location: Location) {
    library.addIconPacks(fas, fab, far);
    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
    // sets the controller status based on route so that it is
    // only available on the game page
    this.router.events.subscribe(() => {
      if (this.location.path() === '/simulation') {
        this.simulationService.setDisableController(false);
      } else {
        this.simulationService.setDisableController(true);
      }
    });
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
      this.simulationService.addStep();
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

  /**
   * Fixes mobile viewport for mobile chrome, etc.
   * See: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
   */
  @HostListener('resize', ['$event'])
  handleResizeEvent(): void {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  /**
   * Is responsible for triggering the animation for the main routing
   *
   * @param outlet - the angular outlet to be used
   *
   * @return a boolean or an empty string that triggers the animation
   */
  public getRouterOutletState(outlet): void {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
