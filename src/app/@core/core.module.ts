import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControllerComponent} from './controller/controller.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { CountAnimationDirective } from './directives/count-animation/count-animation.directive';
import { ExportModalComponent } from './modals/export-modal/export-modal.component';
import {ImportModalComponent} from './modals/import-modal/import-modal.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [ControllerComponent, CountAnimationDirective, ImportModalComponent, ExportModalComponent],
  exports: [
    ControllerComponent,
    CountAnimationDirective,
    ImportModalComponent,
    ExportModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
  ]
})
export class CoreModule { }
