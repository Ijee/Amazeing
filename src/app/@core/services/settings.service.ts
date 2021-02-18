import {Injectable} from '@angular/core';
import {MazeAlgorithms, PathFindingAlgorithms} from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private algorithmMode: string;
  private currentMazeAlgorithm: MazeAlgorithms;
  private currentPathAlgorithm: PathFindingAlgorithms;
  private currentHeuristic: string;
  // Settings
  private darkModeSetting: boolean;
  private animationsSetting: boolean;
  private warningsSetting: boolean;


  constructor() {
    this.algorithmMode = 'maze';
    this.darkModeSetting = false;
    this.animationsSetting = false;
    this.warningsSetting =  false;

    // get the old settings, this converts it back
    this.darkModeSetting = localStorage.getItem('darkModeSetting') === 'true';
    this.animationsSetting = localStorage.getItem('animationsSetting') === 'true';
    this.warningsSetting = localStorage.getItem('warningsSetting') === 'true';
  }

  public setAlgorithmMode(newMode: string): void {
    this.algorithmMode = newMode;
  }

  public setDarkModeSetting(newOption?: boolean): void {
    if (newOption !== undefined) {
      this.darkModeSetting = newOption;
    } else {
      this.darkModeSetting = !this.darkModeSetting;
    }
    localStorage.setItem('darkModeSetting', String(this.darkModeSetting));
  }

  public setAnimationSetting(newOption?: boolean): void {
    if (newOption !== undefined) {
      this.darkModeSetting = newOption;
    } else {
      this.animationsSetting = !this.animationsSetting;
    }
    localStorage.setItem('animationsSetting', String(this.animationsSetting));
  }

  public setWarningsSetting(newOption?: boolean): void {
    if (newOption !== undefined) {
      this.warningsSetting = newOption;
    } else {
      this.warningsSetting = !this.warningsSetting;
    }
    localStorage.setItem('warningsSetting', String(this.warningsSetting));
  }

  public getAlgorithmMode(): string {
    return this.algorithmMode;
  }

  public getdarkModeSetting(): boolean {
    return this.darkModeSetting;
  }

  public getAnimationsSetting(): boolean {
    return this.animationsSetting;
  }

  public getWarningsSetting(): boolean {
    return this.warningsSetting;
  }
}
