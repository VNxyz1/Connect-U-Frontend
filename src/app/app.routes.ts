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
import { SettingsPageComponent } from './views/settings-page/settings-page.component';
import { AccountManagePageComponent } from './views/account-manage-page/account-manage-page.component';

/**
 * If the user is not logged in, he should be redirected to the landingpage (welcome)
 * Documentation: [Angular.dev](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
 */
export const routes: Routes = [
  {
    path: '',
    title: 'Home | Connect-U',
    component: HomePageComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'welcome',
    title: 'Welcome | Connect-U',
    component: LandingPageComponent,
    canActivate: [isNotLoggedInGuard],
  },
  {
    path: 'search',
    title: 'Search | Connect-U',
    component: SearchPageComponent,
  },
  {
    path: 'create-event',
    title: 'New Event | Connect-U',
    component: CreateEventPageComponent,
    canActivate: [isLoggedInGuard],
    children: [
      {
        path: 'step1',
        component: Step1Component,
      },
      {
        path: 'step2',
        component: Step2Component,
      },
      {
        path: 'step3',
        component: Step3Component,
      },
    ],
  },
  {
    path: 'my-events',
    title: 'My Events | Connect-U',
    component: MyEventsPageComponent,
    canActivate: [isLoggedInGuard],
    children: [{ path: 'my-requests', component: UsersEventRequestsComponent }],
  },
  {
    path: 'my-space',
    title: 'My Space | Connect-U',
    component: MySpacePageComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'event/:id',
    title: 'Event | Connect-U',
    component: EventPageComponent,
    children: [
      { path: 'lists', component: EventListsComponent },
      { path: 'surveys', component: EventSurveysComponent },
      { path: 'requests', component: EventRequestsComponent },
    ],
  },
  {
    path: 'profile/:id',
    title: 'Profile | Connect-U',
    component: ProfilePageComponent,
  },
  {
    path: 'styling',
    title: 'Styling | Connect-U',
    component: StylingShowcaseSecretPageComponent,
  },
  {
    path: 'legal-disclosure',
    title: 'Legal Disclosure | Connect-U',
    component: LegalDisclosurePageComponent,
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy | Connect-U',
    component: PrivacyPolicyPageComponent,
  },
  {
    path: '404',
    title: 'Not Found | Connect-U',
    component: NotFoundPageComponent,
  },
  {
    path: 'settings',
    title: 'Settings | Connect-U',
    component: SettingsPageComponent,
  },
  {
    path: 'account',
    title: 'Account | Connect-U',
    component: AccountManagePageComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
