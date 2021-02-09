import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  {
    path: 'simulation',
    loadChildren: () => import('./simulation/simulation.module').then(m => m.SimulationModule),
    data: { reuse: true, key: 'simulation' }

  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
    data: { reuse: false, key: 'about' }
  },
  {
    path: '',
    redirectTo: '/simulation',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
