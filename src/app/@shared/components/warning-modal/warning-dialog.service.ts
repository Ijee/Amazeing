import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WarningDialogService {
  private showDialog: boolean;
  private readonly result: BehaviorSubject<string>;

  constructor() {
    this.showDialog = false;
    this.result = new BehaviorSubject<string>(null);
  }

  /**
   * Opens the dialog.
   */
  public openDialog(): void {
    this.showDialog = true;
  }

  /**
   * Closes the dialog.
   *
   * @param userInput - the option the user chose
   */
  public closeDialog(userInput: string): void {
    this.showDialog = false;
    this.result.next(userInput);
    this.result.next(null);
  }

  /**
   * Returns the input the user chose as an observable
   */
  public afterClosed(): Observable<string> {
    return this.result;
  }

  /**
   * Returns whether or not the dialog should be shown.
   */
  public getDialogStatus(): boolean {
    return this.showDialog;
  }
}
