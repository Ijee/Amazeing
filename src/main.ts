import {
    APP_INITIALIZER,
    enableProdMode,
    importProvidersFrom,
    inject,
    isDevMode
} from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppRoutes } from './app/app.routes';
import {
    Router,
    createUrlTreeFromSnapshot,
    provideRouter,
    withRouterConfig,
    withViewTransitions
} from '@angular/router';
import { SettingsService } from './app/@core/services/settings.service';
import { SwUpdate, provideServiceWorker } from '@angular/service-worker';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule, FontAwesomeModule),
        SettingsService,
        provideRouter(
            AppRoutes,
            withViewTransitions(),
            withRouterConfig({ onSameUrlNavigation: 'reload' })
        ),
        provideAnimationsAsync(),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        })
    ]
}).catch((err) => console.error(err));

// TODO: re-add this
// {
//     onViewTransitionCreated: ({ transition, to }) => {
//         const router = inject(Router);
//         const toTree = createUrlTreeFromSnapshot(to, []);
//         // Skip the transition if the only thing changing is the fragment and queryParams
//         if (
//             router.isActive(toTree, {
//                 paths: 'exact',
//                 matrixParams: 'exact',
//                 fragment: 'ignored',
//                 queryParams: 'ignored'
//             })
//         ) {
//             transition.skipTransition();
//         }
//     }
// }
