import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AboutComponent} from './about.component';
import { AboutRoutingModule } from './about-routing.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [AboutComponent],
    imports: [
        CommonModule,
        AboutRoutingModule,
        FontAwesomeModule
    ]
})
export class AboutModule { }
