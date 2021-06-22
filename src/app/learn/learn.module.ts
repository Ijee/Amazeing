import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnComponent } from './learn.component';
import { LearnRoutingModule } from './learn-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../@shared/shared.module';
import { LearnPrimsComponent } from './learn-prims/learn-prims.component';

@NgModule({
    declarations: [LearnComponent, LearnPrimsComponent],
    imports: [CommonModule, LearnRoutingModule, FontAwesomeModule, SharedModule]
})
export class LearnModule {}
