import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SimulationComponent} from './simulation.component';

const routes: Routes = [
  {
    path: '', component: SimulationComponent
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
