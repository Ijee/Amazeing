import { Injectable } from '@angular/core';
import { driver, PopoverDOM } from 'driver.js';
import { SettingsService } from './settings.service';

@Injectable({
    providedIn: 'root'
})
export class UserTourService {
    private driver: any;

    constructor(private settingsService: SettingsService) {
        this.driver = driver({
            popoverClass: 'tour',
            overlayColor: 'hsl(0, 0%, 21%)',
            showProgress: true,
            stagePadding: 0,
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
                            'This website is meant to visualize various common graph theory algorithms.'
                    }
                },
                {
                    element: '.tourAlgorithmSettings',
                    popover: {
                        title: '> Algorithm Settings',
                        description:
                            'Here you can choose one algorithm at a time to be displayed. ' +
                            'Some may have additional algorithm specific options as well.',
                        side: 'left',
                        align: 'center'
                    }
                },
                {
                    element: '.tourGrid',
                    popover: {
                        title: '> The Grid',
                        description:
                            'Every iteration of the chosen algorithm will be displayed here. ' +
                            'You can also paint on the grid while holding left click.',
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
                            'Changing the start and goal node on the grid can be done through the grid control. ' +
                            'Some algorithms can also utilize node weights. If you are not sure what a specific ' +
                            'node colour represents on the grid you can always check the legend. ',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    element: '.tourAlgoControl',
                    popover: {
                        title: 'Algorithm Controller',
                        description:
                            'Here you can control the algorithm execution itself. Beside the ' +
                            'obvious forward, backwards and autoplay functionality you can also import and export ' +
                            'the current algorithm iteration and share it with other people or to save it for later.',
                        side: 'top',
                        align: 'center'
                    }
                }
            ]
        });
    }

    /**
     * Starts the user tour.
     */
    public startTour(): void {
        setTimeout(() => {
            this.driver.drive();
        }, 0);
    }
}
