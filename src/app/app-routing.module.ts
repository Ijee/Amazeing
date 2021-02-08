import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule),
    data: { reuse: true, key: 'game' }

  },
  {
    path: 'info',
    loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
    data: { reuse: false, key: 'about' }
  },
  {
    path: '',
    redirectTo: '/game',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
