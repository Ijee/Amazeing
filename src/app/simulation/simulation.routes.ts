import { Routes } from '@angular/router';

export const SimulationRoutes: Routes = [
    {
        path: '',
        pathMatch: 'prefix',
        loadComponent: () => import('./simulation.component').then((c) => c.SimulationComponent),
        children: [
            {
                path: 'maze',
                loadComponent: () =>
                    import('./grid-settings/maze-settings/maze-settings.component').then(
                        (m) => m.MazeSettingsComponent
                    )
            },
            {
                path: 'path-finding',
                loadComponent: () =>
                    import(
                        './grid-settings/pathfinding-settings/pathfinding-settings.component'
                    ).then((m) => m.PathfindingSettingsComponent)
            },
            {
                path: '',
                redirectTo: 'maze',
                pathMatch: 'full'
            }
        ]
    }
];
