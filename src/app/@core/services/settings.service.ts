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
    this.darkModeSetting = false;
    this.animationsSetting = false;
    this.warningsSetting = false;

    // Get the old settings. Also converts it back.
    this.darkModeSetting = localStorage.getItem('darkModeSetting') === 'true';
    this.animationsSetting = localStorage.getItem('animationsSetting') === 'true';
    this.warningsSetting = localStorage.getItem('warningsSetting') === 'true';
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
    localStorage.setItem('darkModeSetting', String(this.darkModeSetting));
  }

  /**
   * Sets the current animations setting and saves it to the localStorage.
   *
   * @param newOption - whether or not the option is set
   */
  public setAnimationSetting(newOption?: boolean): void {
    if (newOption !== undefined) {
      this.darkModeSetting = newOption;
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
  public isDarkModeSetting(): boolean {
    return this.darkModeSetting;
  }

  /**
   * Returns the current animations setting.
   */
  public isAnimationsSetting(): boolean {
    return this.animationsSetting;
  }

  /**
   * Returns the current warnings setting.
   */
  public isWarningsSetting(): boolean {
    return this.warningsSetting;
  }
}
