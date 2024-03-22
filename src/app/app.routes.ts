import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const AppRoutes: Routes = [
    {
        path: 'simulation',
        loadChildren: () =>
            import('./simulation/simulation.routes').then((m) => m.SimulationRoutes),
        data: {
            reuse: true,
            key: 'simulation',
            animationState: 'simulation'
        }
    },
    {
        path: 'learn',
        loadChildren: () => import('./learn/learn.routes').then((m) => m.LearnRoutes),
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
