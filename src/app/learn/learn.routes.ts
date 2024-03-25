import { Routes } from '@angular/router';

export const LearnRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./learn.component').then((c) => c.LearnComponent)
    }
];
