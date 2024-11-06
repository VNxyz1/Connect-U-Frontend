import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {apiInterceptor} from './utils/interceptors/api.interceptor';
import {provideRemixIcon, RiHome2Fill} from 'angular-remix-icon';

const icons = {
    RiHome2Fill,
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideClientHydration(),
        provideHttpClient(
            withFetch(),
            withInterceptors([apiInterceptor])
        ),
        provideRemixIcon(icons)
    ]
};
