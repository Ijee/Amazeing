import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnComponent } from './learn.component';
import { LearnRoutingModule } from './learn-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LearnPrimsComponent } from './learn-prims/learn-prims.component';

@NgModule({
    imports: [
        CommonModule,
        LearnRoutingModule,
        FontAwesomeModule,
        LearnComponent,
        LearnPrimsComponent
    ]
})
export class LearnModule {}
