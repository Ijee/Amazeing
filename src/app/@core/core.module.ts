import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CountAnimationDirective} from './directives/count-animation.directive';
import {ExportModalComponent} from './modals/export-modal/export-modal.component';
import {ImportModalComponent} from './modals/import-modal/import-modal.component';
import {FormsModule} from '@angular/forms';
import {LegendModalComponent} from './modals/legend/legend-modal.component';
import {SharedModule} from '../@shared/shared.module';
import { MaxNumberPipe } from './pipes/max-number.pipe';
import { DropZoneDirective } from './directives/drop-zone.directive';

@NgModule({
  declarations: [
    CountAnimationDirective,
    DropZoneDirective,
    ImportModalComponent,
    ExportModalComponent,
    LegendModalComponent,
    MaxNumberPipe,
    DropZoneDirective],
  exports: [
    CountAnimationDirective,
    DropZoneDirective,
    ImportModalComponent,
    ExportModalComponent,
    LegendModalComponent,
    MaxNumberPipe
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
