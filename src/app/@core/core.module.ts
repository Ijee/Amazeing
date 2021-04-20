import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ExportModalComponent} from './modals/export-modal/export-modal.component';
import {ImportModalComponent} from './modals/import-modal/import-modal.component';
import {FormsModule} from '@angular/forms';
import {LegendModalComponent} from './modals/legend/legend-modal.component';
import {SharedModule} from '../@shared/shared.module';

@NgModule({
  declarations: [
    ImportModalComponent,
    ExportModalComponent,
    LegendModalComponent,
  ],
  exports: [
    ImportModalComponent,
    ExportModalComponent,
    LegendModalComponent,
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
