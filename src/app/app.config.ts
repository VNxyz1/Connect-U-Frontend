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
  RiAddLine,
  RiArrowLeftSLine,
  RiBookmarkLine,
  RiCalendarLine,
  RiCheckLine,
  RiFunctionFill,
  RiFunctionLine,
  RiGroupLine,
  RiHeart3Line,
  RiHome2Fill,
  RiHome2Line,
  RiLayoutGridFill,
  RiSearchFill,
  RiMapPin2Line,
  RiPriceTag3Line,
  RiSearchLine,
  RiUser3Fill,
  RiUser3Line,
  RiEyeLine,
  RiEyeOffLine,
} from 'angular-remix-icon';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';

const icons = {
  RiHome2Line,
  RiCheckLine,
  RiBookmarkLine,
  RiSearchLine,
  RiUser3Line,
  RiHeart3Line,
  RiAddLine,
  RiLayoutGridFill,
  RiHome2Fill,
  RiFunctionLine,
  RiUser3Fill,
  RiFunctionFill,
  RiSearchFill,
  RiArrowLeftSLine,
  RiPriceTag3Line,
  RiGroupLine,
  RiCalendarLine,
  RiMapPin2Line,
  RiEyeLine,
  RiEyeOffLine,
};

export const translocoConfig = {
  config: {
    availableLangs: ['en-US', 'de'],
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
    provideTranslocoLocale({
      langToLocaleMapping: {
        'en-US': 'en-US',
        de: 'de-DE',
      },
    }),
  ],
};
