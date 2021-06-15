import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  {
    path: 'simulation',
    loadChildren: () => import('./simulation/simulation.module').then(m => m.SimulationModule),
    data: {
      reuse: true,
      key: 'simulation',
      animation: 'fadeRouteAnimation'
    }
  },
  {
    path: 'learn',
    loadChildren: () => import('./learn/learn.module').then(m => m.LearnModule),
    data: {
      reuse: false,
      key: 'learn',
      animation: 'fadeRouteAnimation'
    }
  },
  {
    path: '',
    redirectTo: 'simulation',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'simulation',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
