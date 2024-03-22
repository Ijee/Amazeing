import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutes } from './app/app.routes';
import { withRouterConfig, provideRouter } from '@angular/router';
import { SettingsService } from './app/@core/services/settings.service';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule, FontAwesomeModule),
        SettingsService,
        provideRouter(AppRoutes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
        provideAnimations()
    ]
}).catch((err) => console.error(err));
