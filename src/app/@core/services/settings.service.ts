import { Injectable } from '@angular/core';
import { AlgorithmMode } from '../../../types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private darkModeSetting: BehaviorSubject<boolean>;
    private animationsSetting: boolean;
    private warningsSetting: boolean;
    private userTourTaken: boolean;
    private userTourActive: boolean;

    constructor() {
        this.darkModeSetting = new BehaviorSubject<boolean>(false);

        // See if prefers color scheme is set. If yes, set the appropriate setting.
        const storagePrefersDarkColor = localStorage.getItem('prefersDarkColor');
        console.log(JSON.stringify(storagePrefersDarkColor));
        if (storagePrefersDarkColor === null) {
            const prefersDarkColor = window.matchMedia('(prefers-color-scheme: dark)');
            console.log('matchMedia', prefersDarkColor);
            if (!prefersDarkColor || prefersDarkColor.matches) {
                this.setDarkModeSetting(true);
            } else {
                this.setDarkModeSetting(false);
            }
        } else {
            this.setDarkModeSetting(storagePrefersDarkColor === 'true');
        }
        // See if prefers reduced motion is set. If yes, set the appropriate setting.
        const storagePrefersReducedMotion = localStorage.getItem('animationsSetting');
        if (storagePrefersReducedMotion === null) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (!prefersReducedMotion || prefersReducedMotion.matches) {
                this.setAnimationSetting(false);
            } else {
                this.setAnimationSetting(true);
            }
        } else {
            this.setAnimationSetting(storagePrefersReducedMotion === 'true');
        }
        // See if warnings setting is already set if yes set it for the app.
        const storageWarningSetting = localStorage.getItem('warningsSetting');
        if (storageWarningSetting === null) {
            this.setWarningsSetting(true);
        } else {
            this.setWarningsSetting(storageWarningSetting === 'true');
        }

        const userTour = localStorage.getItem('userTourTaken');
        if (userTour === null) {
            this.setUserTourTaken(false);
        } else {
            this.setUserTourTaken(userTour === 'true');
        }
        this.userTourActive = false;
    }

    /**
     * Sets the current dark mode setting and saves it to the localStorage.
     *
     * @param newOption - whether the option is set
     */
    public setDarkModeSetting(newOption?: boolean): void {
        if (newOption !== undefined) {
            this.darkModeSetting.next(newOption);
        } else {
            this.darkModeSetting.next(!this.darkModeSetting.getValue());
        }
        localStorage.setItem('prefersDarkColor', String(this.darkModeSetting.value));
    }

    /**
     * Sets the current animations setting and saves it to the localStorage.
     *
     * @param newOption the new option
     */
    public setAnimationSetting(newOption?: boolean): void {
        if (newOption !== undefined) {
            this.animationsSetting = newOption;
        } else {
            this.animationsSetting = !this.animationsSetting;
        }
        localStorage.setItem('animationsSetting', String(this.animationsSetting));
    }

    /**
     * Sets the current warnings setting and saves it to the localStorage.
     *
     * @param newOption the new option
     */
    public setWarningsSetting(newOption?: boolean): void {
        if (newOption !== undefined) {
            this.warningsSetting = newOption;
        } else {
            this.warningsSetting = !this.warningsSetting;
        }
        localStorage.setItem('warningsSetting', String(this.warningsSetting));
    }

    /**
     * Sets the userTourTaken and saves it to the localStorage.
     *
     * @param newOption the new option
     */
    public setUserTourTaken(newOption: boolean): void {
        this.userTourTaken = newOption;
        localStorage.setItem('userTourTaken', String(this.userTourTaken));
    }

    /**
     * Sets whether the  user tour is currently active.
     *
     * @param newOption the new option
     */
    public setUserTourActive(newOption: boolean): void {
        this.userTourActive = newOption;
    }

    /**
     * Returns the current dark mode setting.
     */
    public getDarkModeSetting(): Observable<boolean> {
        return this.darkModeSetting;
    }

    /**
     * Returns the current animations setting.
     */
    public getAnimationsSetting(): boolean {
        return this.animationsSetting;
    }

    /**
     * Returns the current warnings setting.
     */
    public getWarningsSetting(): boolean {
        return this.warningsSetting;
    }

    /**
     * Returns whether the user already did the user tour.
     */
    public getUserTourTaken(): boolean {
        return this.userTourTaken;
    }

    /**
     * Returns whether the user tour is currently active.
     */
    public getUserTourActive(): boolean {
        return this.userTourActive;
    }
}
