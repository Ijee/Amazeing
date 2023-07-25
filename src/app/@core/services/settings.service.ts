import { Injectable } from '@angular/core';
import { AlgorithmMode } from '../../../types';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private darkModeSetting: boolean;
    private animationsSetting: boolean;
    private warningsSetting: boolean;

    constructor() {
        // See if prefers color scheme is set. If yes, set the appropriate setting.
        const storagePrefersDarkColor = localStorage.getItem('prefersDarkColor');
        if (storagePrefersDarkColor === null) {
            const prefersDarkColor = window.matchMedia('(prefers-color-scheme: dark)');
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
    }

    /**
     * Sets the current dark mode setting and saves it to the localStorage.
     *
     * @param newOption - whether or not the option is set
     */
    public setDarkModeSetting(newOption?: boolean): void {
        if (newOption !== undefined) {
            this.darkModeSetting = newOption;
        } else {
            this.darkModeSetting = !this.darkModeSetting;
        }
        localStorage.setItem('prefersDarkColor', String(this.darkModeSetting));
    }

    /**
     * Sets the current animations setting and saves it to the localStorage.
     *
     * @param newOption - whether or not the option is set
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
     * @param newOption - whether or not the option is set
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
     * Returns the current dark mode setting.
     */
    public getDarkModeSetting(): boolean {
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
}
