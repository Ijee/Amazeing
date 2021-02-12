import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly algorithmMode: BehaviorSubject<string>;
  private readonly currentAlgorithm: BehaviorSubject<string>;
  private readonly currentHeuristic: BehaviorSubject<string>;

  constructor() {
    this.algorithmMode = new BehaviorSubject<string>('maze');
    this.currentAlgorithm = new BehaviorSubject<string>('prims');
    this.currentHeuristic = new BehaviorSubject<string>('manhattan');
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

  public getAlgorithmMode(): Observable<string> {
    return this.algorithmMode;
  }

  public getcurrentAlgorithm(): Observable<string> {
    return this.currentAlgorithm;
  }

  public getCurrentHeuristic(): Observable<string> {
    return this.currentHeuristic;
  }
}
