import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'simulation',
        loadChildren: () =>
            import('./simulation/simulation.module').then((m) => m.SimulationModule),
        data: {
            reuse: true,
            key: 'simulation',
            animationState: 'simulation'
        }
    },
    {
        path: 'learn',
        loadChildren: () => import('./learn/learn.module').then((m) => m.LearnModule),
        data: {
            reuse: false,
            key: 'learn',
            animationState: 'learn'
        }
    },
    // {
    //     path: '',
    //     redirectTo: 'simulation',
    //     pathMatch: 'full'
    // },
    {
        path: '**',
        redirectTo: 'simulation',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule {}
