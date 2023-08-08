import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrComponent } from './components/hr/hr.component';
import { WarningModalComponent } from './components/warning-modal/warning-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { CountAnimationDirective } from './directives/count-animation.directive';
import { MaxNumberPipe } from './pipes/max-number.pipe';
import { DisableControlDirective } from './directives/disable-control.directive';

@NgModule({
    declarations: [
        DropZoneDirective,
        CountAnimationDirective,
        MaxNumberPipe,
        HrComponent,
        WarningModalComponent,
        DisableControlDirective
    ],
    exports: [
        DropZoneDirective,
        CountAnimationDirective,
        MaxNumberPipe,
        HrComponent,
        WarningModalComponent,
        DisableControlDirective
    ],
    imports: [CommonModule, FontAwesomeModule]
})
export class SharedModule {}
