import { Injectable, inject } from '@angular/core';
import { driver } from 'driver.js';
import { SettingsService } from './settings.service';

@Injectable({
    providedIn: 'root'
})
export class UserTourService {
    private settingsService = inject(SettingsService);

    private driver: any;

    /**
     * Starts the user tour.
     */
    public startTour(animate: boolean): void {
        this.driver = driver({
            animate: animate,
            overlayOpacity: 0.7,
            popoverClass: 'tour',
            overlayColor: 'var(--modal-background-background-color)',
            stagePadding: 8,
            nextBtnText: 'Next',
            prevBtnText: 'Previous',
            doneBtnText: 'Complete',
            onDestroyed: () => {
                this.settingsService.setUserTourActive(false);
            },
            steps: [
                {
                    popover: {
                        title: '> What am I looking at?',
                        description:
                            'This project aims to visualize various algorithms to create or traverse mazes on a 2D grid graph.'
                    }
                },
                {
                    element: '.tourAlgorithmSettings',
                    popover: {
                        title: '> Algorithm Settings',
                        description:
                            'Here you can choose which algorithm to use. ' +
                            'Some may have additional algorithm specific options as well which can be found below when available',
                        side: 'left',
                        align: 'center'
                    }
                },
                {
                    element: '.tourAlgorithmMode',
                    popover: {
                        title: '> Algorithm Mode',
                        description:
                            'There are two algorithm modes to either create mazes or to traverse them. ' +
                            'That way you can see how certain maze layout characteristics can affect the applied pathfinding algorithm',
                        side: 'bottom',
                        align: 'center'
                    }
                },
                {
                    element: '.tourGrid',
                    popover: {
                        title: '> The Grid',
                        description:
                            'Every iteration of the previously chosen algorithm will be displayed here. ' +
                            'You can also paint and erase walls on the grid yourself while holding left click but not during the algorithm execution.',
                        side: 'right',
                        align: 'center'
                    }
                },
                {
                    element: '.tourStats',
                    popover: {
                        title: '> Stats',
                        description:
                            'The current iteration, speed as well as algorithm specific statistics will be shown here.',
                        side: 'bottom',
                        align: 'center'
                    }
                },
                {
                    element: '.tourGridControl',
                    popover: {
                        title: '> Grid Control',
                        description:
                            'Here you can set the start/goal node as well as adding node weights randomly from 1-9. ' +
                            'Not every algorithm allows node weights and you can see the what each colour represents on the grid by ' +
                            'opening the legend.',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    element: '.tourAlgoControl',
                    popover: {
                        title: '> Algorithm Controller',
                        description:
                            'Here you can control the algorithm execution itself. Besides the ' +
                            'obvious forward, backwards and autoplay functionality you can also import and export ' +
                            'the current algorithm iteration and share it with other people or to save the current state',
                        side: 'top',
                        align: 'center'
                    }
                }
            ]
        });
        this.driver.drive();
    }
}
