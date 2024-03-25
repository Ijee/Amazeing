import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WarningDialogService {
    private showDialog: boolean;
    private readonly result: Subject<string>;

    constructor() {
        this.showDialog = false;
        this.result = new Subject<string>();
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
     * Returns whether  the dialog should be shown.
     */
    public getDialogStatus(): boolean {
        return this.showDialog;
    }
}
