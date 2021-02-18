import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HrComponent} from './components/hr/hr.component';



@NgModule({
  declarations: [HrComponent],
  exports: [
    HrComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
