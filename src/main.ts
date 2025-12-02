import {
    enableProdMode,
    importProvidersFrom,
    inject,
    isDevMode,
    provideZoneChangeDetection
} from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppRoutes } from './app/app.routes';
import {
    provideRouter,
    withComponentInputBinding,
    withRouterConfig,
    withViewTransitions
} from '@angular/router';
import { SettingsService } from './app/@core/services/settings.service';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch } from '@angular/common/http';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(),
        importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule, FontAwesomeModule),
        SettingsService,
        provideRouter(
            AppRoutes,
            withComponentInputBinding(),
            withViewTransitions({
                skipInitialTransition: true,
                onViewTransitionCreated: ({ transition }) => {
                    // Check if view-transitino should play.
                    const settingsService = inject(SettingsService);
                    if (!settingsService.getAnimationsSetting()) {
                        transition.skipTransition();
                    }
                }
            }),
            withRouterConfig({ onSameUrlNavigation: 'ignore' })
        ),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        provideHttpClient(withFetch())
    ]
}).catch((err) => console.error(err));
