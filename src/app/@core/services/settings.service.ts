import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly algorithmMode: BehaviorSubject<string>;
  private readonly currentAlgorithm: BehaviorSubject<string>;
  private readonly currentHeuristic: BehaviorSubject<string>;
  // Settings
  private readonly darkModeSetting: BehaviorSubject<boolean>;
  private readonly animationsSetting: BehaviorSubject<boolean>;
  private readonly warningsSetting: BehaviorSubject<boolean>;


  constructor() {
    this.algorithmMode = new BehaviorSubject<string>('maze');
    this.currentAlgorithm = new BehaviorSubject<string>('prims');
    this.currentHeuristic = new BehaviorSubject<string>('manhattan');
    this.darkModeSetting = new BehaviorSubject<boolean>(false);
    this.animationsSetting = new BehaviorSubject<boolean>(false);
    this.warningsSetting = new BehaviorSubject<boolean>(false);

    // get the old settings, this converts it back (also if undefined === true -> false, thanks js)
    this.darkModeSetting.next(localStorage.getItem('darkModeSetting') === 'true');
    this.animationsSetting.next(localStorage.getItem('animationsSetting') === 'true');
    this.warningsSetting.next(localStorage.getItem('warningsSetting') === 'true');
  }

  public setAlgorithmMode(newMode: string): void {
    this.algorithmMode.next(newMode);
  }

  public setCurrentAlgorithm(newAlgorithm: string): void {
    this.currentAlgorithm.next(newAlgorithm);
  }

  public setCurrentHeuristic(newHeuristic): void {
    this.currentHeuristic.next(newHeuristic);
  }

  public setDarkModeSetting(newOption?: boolean): void {
    if (newOption !== undefined) {
      this.darkModeSetting.next(newOption);
    } else {
      this.darkModeSetting.next(!(this.darkModeSetting.getValue()));
    }
    localStorage.setItem('darkModeSetting', String(this.darkModeSetting.getValue()));
  }

  public setAnimationSetting(newOption?: boolean): void {
    if (newOption !== undefined) {
      this.animationsSetting.next(newOption);
    } else {
      this.animationsSetting.next(!(this.animationsSetting.getValue()));
    }
    localStorage.setItem('animationsSetting', String(this.animationsSetting.getValue()));
  }

  public setWarningsSetting(newOption?: boolean): void {
    if (newOption !== undefined) {
      this.warningsSetting.next(newOption);
    } else {
      this.warningsSetting.next(!(this.warningsSetting.getValue()));
    }
    localStorage.setItem('warningsSetting', String(this.warningsSetting.getValue()));
  }

  public getAlgorithmMode(): Observable<string> {
    return this.algorithmMode;
  }

  public getcurrentAlgorithm(): Observable<string> {
    return this.currentAlgorithm;
  }

  public getCurrentHeuristic(): Observable<string> {
    return this.currentHeuristic;
  }

  public getdarkModeSetting(): Observable<boolean> {
    return this.darkModeSetting;
  }

  public getAnimationsSetting(): Observable<boolean> {
    return this.animationsSetting;
  }

  public getWarningsSetting(): Observable<boolean> {
    return this.warningsSetting;
  }
}
