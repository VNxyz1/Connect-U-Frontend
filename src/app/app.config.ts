import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
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
  RiArrowRightCircleLine,
  RiArrowLeftCircleLine,
  RiTimeLine,
  RiInformation2Line,
  RiAlertLine,
  RiArrowGoBackLine,
  RiArrowDownLine,
  RiCheckboxLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowRightSLine,
  RiEditLine,
  RiChatPollLine,
  RiFolderInfoLine,
  RiListCheck,
  RiCloseLine,
  RiSettings5Line,
  RiLogoutBoxLine,
  RiMailSendLine,
  RiHistoryLine,
  RiHourglassFill,
  RiLiveLine,
  RiCalendarCloseLine,
  RiEdit2Line,
  RiLogoutCircleLine,
  RiAddCircleLine,
  RiStarFill,
  RiShieldCheckLine,
  RiFlagLine,
  RiScales3Line,
  RiIdCardLine,
  RiDeleteBinLine,
  RiArrowDownSLine,
  RiChat3Line,
  RiVipCrown2Fill,
} from 'angular-remix-icon';
import { TranslocoHttpLoader } from './transloco-loader';
import {
  provideTransloco,
  TranslocoMissingHandler,
  TranslocoMissingHandlerData,
} from '@jsverse/transloco';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { IonicStorageModule } from '@ionic/storage-angular';

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
  RiArrowRightCircleLine,
  RiArrowLeftCircleLine,
  RiTimeLine,
  RiInformation2Line,
  RiAlertLine,
  RiArrowGoBackLine,
  RiCheckboxLine,
  RiArrowDownLine,
  RiEyeLine,
  RiEyeOffLine,
  RiChatPollLine,
  RiFolderInfoLine,
  RiListCheck,
  RiCloseLine,
  RiArrowRightSLine,
  RiSettings5Line,
  RiLogoutBoxLine,
  RiMailSendLine,
  RiHourglassFill,
  RiHistoryLine,
  RiLiveLine,
  RiCalendarCloseLine,
  RiDeleteBinLine,
  RiArrowDownSLine,
  RiEditLine,
  RiEdit2Line,
  RiLogoutCircleLine,
  RiAddCircleLine,
  RiShieldCheckLine,
  RiFlagLine,
  RiScales3Line,
  RiIdCardLine,
  RiStarFill,
  RiChat3Line,
  RiVipCrown2Fill,
};

// Custom missing handler to avoid console logs for missing keys
export const customMissingHandler = {
  handle: (
    key: string,
    data: TranslocoMissingHandlerData,
    params?: Record<string, any>,
  ) => {
    console.error('Missing translation key:', key);
    return key; // Return the key itself as a fallback
  },
};

export const translocoConfig = {
  config: {
    availableLangs: ['en-US', 'de'],
    defaultLang: 'de',
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
    missingHandler: { logMissingKey: false }, // Disable missing key logs globally
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
    provideHttpClient(
      withFetch(),
      withInterceptors([apiInterceptor, jwtInterceptor]),
    ),
    provideAnimationsAsync(),
    provideRemixIcon(icons),
    provideHttpClient(),
    provideTransloco(translocoConfig),
    importProvidersFrom(IonicStorageModule.forRoot()),
    provideTranslocoLocale({
      langToLocaleMapping: {
        'en-US': 'en-US',
        de: 'de-DE',
      },
    }),
  ],
};
