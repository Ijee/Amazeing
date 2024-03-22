import { Routes } from '@angular/router';
import { LearnComponent } from './learn.component';

export const LearnRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./learn.component').then((c) => c.LearnComponent)
    }
];
