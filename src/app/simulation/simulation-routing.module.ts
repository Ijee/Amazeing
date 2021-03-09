import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SimulationComponent} from './simulation.component';
import {MazeSettingsComponent} from './grid-settings/maze-settings/maze-settings.component';
import {PathfindingSettingsComponent} from './grid-settings/pathfinding-settings/pathfinding-settings.component';
import {GridSettingsComponent} from './grid-settings/grid-settings.component';

const routes: Routes = [
  {
    path: '',
    component: SimulationComponent,
    children: [
      {
        path: '',
        component: GridSettingsComponent,
        children: [
          {
            path: 'maze',
            component: MazeSettingsComponent
          },
          {
            path: 'path-finding',
            component: PathfindingSettingsComponent
          },
          {
            path: '',
            redirectTo: 'maze'
          }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SimulationRoutingModule { }
