import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GridComponent} from './grid/grid.component';
import {NodeComponent} from './grid/node/node.component';
import {StatsComponent} from './grid/stats/stats.component';
import {SimulationRoutingModule} from './simulation-routing.module';
import {CoreModule} from '../@core/core.module';
import {SimulationComponent} from './simulation.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {GridSettingsComponent} from './grid-settings/grid-settings.component';
import {MazeSettingsComponent} from './grid-settings/maze-settings/maze-settings.component';
import {PathfindingSettingsComponent} from './grid-settings/pathfinding-settings/pathfinding-settings.component';
import {SharedModule} from '../@shared/shared.module';
import {ControllerComponent} from './controller/controller.component';

@NgModule({
  declarations: [SimulationComponent, GridComponent, NodeComponent, StatsComponent,
    GridSettingsComponent, MazeSettingsComponent, PathfindingSettingsComponent, ControllerComponent],
  imports: [
    CommonModule,
    SimulationRoutingModule,
    CoreModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: []
})
export class SimulationModule {
}
