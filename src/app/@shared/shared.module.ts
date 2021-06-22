import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrComponent } from './components/hr/hr.component';
import { WarningModalComponent } from './components/warning-modal/warning-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { CountAnimationDirective } from './directives/count-animation.directive';
import { MaxNumberPipe } from './pipes/max-number.pipe';

@NgModule({
    declarations: [
        DropZoneDirective,
        CountAnimationDirective,
        MaxNumberPipe,
        HrComponent,
        WarningModalComponent
    ],
    exports: [
        DropZoneDirective,
        CountAnimationDirective,
        MaxNumberPipe,
        HrComponent,
        WarningModalComponent
    ],
    imports: [CommonModule, FontAwesomeModule]
})
export class SharedModule {}
