import {Injectable, Renderer2} from '@angular/core';
import {AlgorithmMode} from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private algorithmMode: AlgorithmMode;
  private darkModeSetting: boolean;
  private animationsSetting: boolean;
  private warningsSetting: boolean;


  constructor() {
    // See if prefers color scheme motion is set. If yes, set the appropriate setting.
    const prefersDarkColor = window.matchMedia('(prefers-color-scheme: dark)');
    if ((!prefersDarkColor || prefersDarkColor.matches)
      && localStorage.getItem('prefersDarkColor') === null) {
      this.setDarkModeSetting(true);
      console.log('what');
    } else {
      this.setDarkModeSetting(false);
      console.log('why');
    }
    // See if prefers reduced motion is set. If yes, set the appropriate setting.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if ((!prefersReducedMotion || prefersReducedMotion.matches)
      && localStorage.getItem('animationsSetting') === null) {
      this.setAnimationSetting(false);
    } else {
      this.setAnimationSetting(true);
    }
    // See if warnings setting is already set if yes set it for the app.
    if (localStorage.getItem('warningsSetting') === null) {
      this.setWarningsSetting(true);
    } else {
      this.setWarningsSetting(localStorage.getItem('warningsSetting') === 'true');
    }
  }

  /**
   * Sets the new algorithm mode.
   *
   * @param newMode - the new algorithm mode ('maze' | 'path-finding')
   */
  public setAlgorithmMode(newMode: AlgorithmMode): void {
    try {
      this.algorithmMode = newMode;
    } catch {
      throw new Error('Could not set the algorithm mode!');
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
   * Returns the current algorithm mode.
   */
  public getAlgorithmMode(): AlgorithmMode {
    return this.algorithmMode;
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
