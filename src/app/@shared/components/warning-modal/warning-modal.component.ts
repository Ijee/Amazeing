import { Component, OnInit } from '@angular/core';
import {WarningDialogService} from './warning-dialog.service';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.scss'],
})
export class WarningModalComponent implements OnInit {

  constructor(public warningDialog: WarningDialogService) { }

  ngOnInit(): void {
  }

}
