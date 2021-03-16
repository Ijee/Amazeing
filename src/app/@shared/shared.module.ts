import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HrComponent} from './components/hr/hr.component';
import { WarningModalComponent } from './components/warning-modal/warning-modal.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [HrComponent, WarningModalComponent],
  exports: [
    HrComponent,
    WarningModalComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class SharedModule { }
