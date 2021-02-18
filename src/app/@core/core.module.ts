import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControllerComponent} from './controller/controller.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CountAnimationDirective} from './directives/count-animation/count-animation.directive';
import {ExportModalComponent} from './modals/export-modal/export-modal.component';
import {ImportModalComponent} from './modals/import-modal/import-modal.component';
import {FormsModule} from '@angular/forms';
import {LegendModalComponent} from './modals/legend/legend-modal.component';
import {SharedModule} from '../@shared/shared.module';

@NgModule({
  declarations: [
    ControllerComponent,
    CountAnimationDirective,
    ImportModalComponent,
    ExportModalComponent,
    LegendModalComponent],
  exports: [
    ControllerComponent,
    CountAnimationDirective,
    ImportModalComponent,
    ExportModalComponent,
    LegendModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    SharedModule,
  ]
})
export class CoreModule {
}
