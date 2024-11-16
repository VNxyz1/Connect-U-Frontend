import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { apiInterceptor } from './utils/interceptors/api.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { jwtInterceptor } from './utils/interceptors/jwt.interceptor';
import {
  provideRemixIcon,
  RiBookmarkLine,
  RiCalendarLine,
  RiCheckLine,
  RiGroupLine,
  RiHeart3Line,
  RiHome2Line,
  RiMapPin2Line,
  RiPriceTag3Line,
  RiSearchLine,
  RiUser3Line,
} from 'angular-remix-icon';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';

const icons = {
  RiHome2Line,
  RiCheckLine,
  RiBookmarkLine,
  RiSearchLine,
  RiUser3Line,
  RiHeart3Line,
  RiPriceTag3Line,
  RiGroupLine,
  RiCalendarLine,
  RiMapPin2Line,
};

export const translocoConfig = {
  config: {
    availableLangs: ['en', 'de'],
    defaultLang: 'de',
    // Remove this option if your application doesn't support changing language in runtime.
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
  },
  loader: TranslocoHttpLoader,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiInterceptor, jwtInterceptor]),
    ),
    provideAnimationsAsync(),
    provideRemixIcon(icons),
    provideHttpClient(),
    provideTransloco(translocoConfig),
  ],
};
