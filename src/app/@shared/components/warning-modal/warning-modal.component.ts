import { Component, OnInit } from '@angular/core';
import {modalAnimation} from '../../animations/modalAnimation';
import {WarningDialogService} from './warning-dialog.service';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.scss'],
  animations: [modalAnimation]
})
export class WarningModalComponent implements OnInit {

  constructor(public warningDialog: WarningDialogService) { }

  ngOnInit(): void {
  }

}
