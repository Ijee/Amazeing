import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GridComponent} from './grid/grid.component';
import {NodeComponent} from './grid/node/node.component';
import {StatsComponent} from './grid/stats/stats.component';
import {SimulationRoutingModule} from './simulation-routing.module';
import {CoreModule} from '../@core/core.module';
import { GridSettingsComponent } from './grid-settings/grid-settings.component';
import {SimulationComponent} from './simulation.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [SimulationComponent, GridComponent, NodeComponent, StatsComponent, GridSettingsComponent],
  imports: [
    CommonModule,
    SimulationRoutingModule,
    CoreModule,
    FontAwesomeModule
  ],
  providers: []
})
export class SimulationModule { }
