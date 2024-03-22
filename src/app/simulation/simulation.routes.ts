import { Routes } from '@angular/router';
import { SimulationComponent } from './simulation.component';
import { MazeSettingsComponent } from './grid-settings/maze-settings/maze-settings.component';
import { PathfindingSettingsComponent } from './grid-settings/pathfinding-settings/pathfinding-settings.component';

export const SimulationRoutes: Routes = [
    {
        path: '',
        pathMatch: 'prefix',
        loadComponent: () => import('./simulation.component').then((c) => c.SimulationComponent),
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
                redirectTo: 'maze',
                pathMatch: 'full'
            }
        ]
    }
];
