import { Routes } from '@angular/router';
import { HomePageComponent } from './views/home-page/home-page.component';
import { SearchPageComponent } from './views/search-page/search-page.component';
import { CreateEventPageComponent } from './views/create-event-page/create-event-page.component';
import { MyEventsPageComponent } from './views/my-events-page/my-events-page.component';
import { MySpacePageComponent } from './views/my-space-page/my-space-page.component';
import { EventPageComponent } from './views/event-page/event-page.component';
import { NotFoundPageComponent } from './views/not-found-page/not-found-page.component';
import { ProfilePageComponent } from './views/profile-page/profile-page.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { StylingShowcaseSecretPageComponent } from './views/styling-showcase-secret-page/styling-showcase-secret-page.component';
import { isLoggedInGuard } from './utils/guards/is-logged-in.guard';
import { Step1Component } from './components/create-event/step1/step1.component';
import { Step2Component } from './components/create-event/step2/step2.component';
import { Step3Component } from './components/create-event/step3/step3.component';
import { isNotLoggedInGuard } from './utils/guards/is-not-logged-in.guard';
import { LegalDisclosurePageComponent } from './views/legal-disclosure-page/legal-disclosure-page.component';
import { PrivacyPolicyPageComponent } from './views/privacy-policy-page/privacy-policy-page.component';
import { EventListsComponent } from './components/event-detail/event-lists/event-lists.component';
import { EventSurveysComponent } from './components/event-detail/event-surveys/event-surveys.component';
import { EventRequestsComponent } from './components/event-detail/event-requests/event-requests.component';
import { UsersEventRequestsComponent } from './components/my-events/users-event-requests/users-event-requests.component';
import { ListOverviewPageComponent } from './components/event-detail/event-lists/list-overview-page/list-overview-page.component';
import { ListDetailPageComponent } from './components/event-detail/event-lists/list-detail-page/list-detail-page.component';
import { SettingsPageComponent } from './views/settings-page/settings-page.component';
import { AccountManagePageComponent } from './views/account-manage-page/account-manage-page.component';
import { EventGuestsComponent } from './components/event-detail/event-guests/event-guests.component';
import { InformationPageComponent } from './views/information-page/information-page.component';
import { TermsPageComponent } from './views/terms-page/terms-page.component';
import { EventChatComponent } from './components/event-detail/event-chat/event-chat.component';
import { ShareProfilePageComponent } from './views/share-profile-page/share-profile-page.component';
import { AddFriendComponent } from './views/add-friend/add-friend.component';
import { QrCodeAndLinkComponent } from './components/qr-code-and-link/qr-code-and-link.component';
import { CameraComponent } from './components/camera/camera.component';
import { ServerUnavailablePageComponent } from './views/server-unavailable-page/server-unavailable-page.component';
import { AppRoutes } from './interfaces/AppRoutes';

/**
 * If the user is not logged in, he should be redirected to the landingpage (welcome)
 * Documentation: [Angular.dev](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
 */
export const routes: Routes = [
  {
    path: AppRoutes.HOME,
    title: 'Home | Connect-U',
    component: HomePageComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'unavailable',
    title: 'Server unavailable | Connect-U',
    component: ServerUnavailablePageComponent,
  },
  {
    path: AppRoutes.WELCOME,
    title: 'Welcome | Connect-U',
    component: LandingPageComponent,
    canActivate: [isNotLoggedInGuard],
  },
  {
    path: AppRoutes.SEARCH,
    title: 'Search | Connect-U',
    component: SearchPageComponent,
  },
  {
    path: AppRoutes.CREATE_EVENT,
    title: 'New Event | Connect-U',
    component: CreateEventPageComponent,
    canActivate: [isLoggedInGuard],
    children: [
      {
        path: AppRoutes.CREATE_EVENT_STEP1.replace(
          AppRoutes.CREATE_EVENT + '/',
          '',
        ),
        component: Step1Component,
      },
      {
        path: AppRoutes.CREATE_EVENT_STEP2.replace(
          AppRoutes.CREATE_EVENT + '/',
          '',
        ),
        component: Step2Component,
      },
      {
        path: AppRoutes.CREATE_EVENT_STEP3.replace(
          AppRoutes.CREATE_EVENT + '/',
          '',
        ),
        component: Step3Component,
      },
    ],
  },
  {
    path: AppRoutes.MY_EVENTS,
    title: 'My Events | Connect-U',
    component: MyEventsPageComponent,
    canActivate: [isLoggedInGuard],
    children: [
      {
        path: AppRoutes.MY_EVENTS_REQUESTS.replace(
          AppRoutes.MY_EVENTS + '/',
          '',
        ),
        component: UsersEventRequestsComponent,
      },
    ],
  },
  {
    path: AppRoutes.MY_SPACE,
    title: 'My Space | Connect-U',
    component: MySpacePageComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: AppRoutes.EVENT,
    title: 'Event | Connect-U',
    component: EventPageComponent,
    children: [
      {
        path: AppRoutes.EVENT_CHAT.replace(AppRoutes.EVENT + '/', ''),
        component: EventChatComponent,
        canActivate: [isLoggedInGuard],
      },
      {
        path: AppRoutes.EVENT_LISTS.replace(AppRoutes.EVENT + '/', ''),
        component: EventListsComponent,
        canActivate: [isLoggedInGuard],
        children: [
          {
            path: AppRoutes.EVENT_LISTS_OVERVIEW.replace(
              AppRoutes.EVENT_LISTS + '/',
              '',
            ),
            component: ListOverviewPageComponent,
          },
          {
            path: AppRoutes.EVENT_LISTS_DETAIL.replace(
              AppRoutes.EVENT_LISTS + '/',
              '',
            ),
            component: ListDetailPageComponent,
          },
        ],
      },
      {
        path: AppRoutes.EVENT_SURVEYS.replace(AppRoutes.EVENT + '/', ''),
        component: EventSurveysComponent,
        canActivate: [isLoggedInGuard],
      },
      {
        path: AppRoutes.EVENT_REQUESTS.replace(AppRoutes.EVENT + '/', ''),
        component: EventRequestsComponent,
        canActivate: [isLoggedInGuard],
      },
      {
        path: AppRoutes.EVENT_GUESTS.replace(AppRoutes.EVENT + '/', ''),
        component: EventGuestsComponent,
        canActivate: [isLoggedInGuard],
      },
    ],
  },
  {
    path: AppRoutes.PROFILE,
    title: 'Profile | Connect-U',
    component: ProfilePageComponent,
  },
  {
    path: AppRoutes.STYLING,
    title: 'Styling | Connect-U',
    component: StylingShowcaseSecretPageComponent,
  },
  {
    path: AppRoutes.LEGAL_DISCLOSURE,
    title: 'Legal Disclosure | Connect-U',
    component: LegalDisclosurePageComponent,
  },
  {
    path: AppRoutes.PRIVACY_POLICY,
    title: 'Privacy Policy | Connect-U',
    component: PrivacyPolicyPageComponent,
  },

  {
    path: AppRoutes.TERMS_AND_CONDITIONS,
    title: 'Terms and Conditions | Connect-U',
    component: TermsPageComponent,
  },
  {
    path: AppRoutes.NOT_FOUND,
    title: 'Not Found | Connect-U',
    component: NotFoundPageComponent,
  },
  {
    path: AppRoutes.SETTINGS,
    title: 'Settings | Connect-U',
    component: SettingsPageComponent,
  },
  {
    path: AppRoutes.INFORMATION,
    title: 'Information | Connect-U',
    component: InformationPageComponent,
  },
  {
    path: AppRoutes.ACCOUNT,
    title: 'Account | Connect-U',
    component: AccountManagePageComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: AppRoutes.SHARE_PROFILE,
    title: 'Share | Connect-U',
    component: ShareProfilePageComponent,
    canActivate: [isLoggedInGuard],
    children: [
      {
        path: 'show-link',
        title: 'Link | Connect-U',
        component: QrCodeAndLinkComponent,
        canActivate: [isLoggedInGuard],
      },
      {
        path: 'scan-qr',
        title: 'Scan QR Code | Connect-U',
        component: CameraComponent,
        canActivate: [isLoggedInGuard],
      },
    ],
  },
  {
    path: AppRoutes.ADD_FRIEND,
    title: 'Add a Friend | Connect-U',
    component: AddFriendComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: AppRoutes.WILDCARD,
    redirectTo: AppRoutes.NOT_FOUND,
  },
];
