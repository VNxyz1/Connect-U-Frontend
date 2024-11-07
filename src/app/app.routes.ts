import { Routes } from '@angular/router';
import {HomePageComponent} from './views/home-page/home-page.component';
import {SearchPageComponent} from './views/search-page/search-page.component';
import {CreateEventPageComponent} from './views/create-event-page/create-event-page.component';
import {MyEventsPageComponent} from './views/my-events-page/my-events-page.component';
import {MySpacePageComponent} from './views/my-space-page/my-space-page.component';
import {EventDetailPageComponent} from './views/event-detail-page/event-detail-page.component';
import {NotFoundPageComponent} from './views/not-found-page/not-found-page.component';
import {ProfilePageComponent} from './views/profile-page/profile-page.component';
import {LandingPageComponent} from './views/landing-page/landing-page.component';
import {isLoggedInGuard} from './utils/guards/is-logged-in.guard';

/**
 * If the user is not logged in, he should be redirected to the landingpage (welcome)
 * Documentation: [Angular.dev](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
 */
export const routes: Routes = [
    { path: '', title: 'Home | Connect-U', component: HomePageComponent },
    { path: 'welcome', title: 'Welcome | Connect-U', component: LandingPageComponent },
    { path: 'search', title: 'Search | Connect-U', component: SearchPageComponent },
    { path: 'create-event', title: 'New Event | Connect-U', component: CreateEventPageComponent, canActivate: [isLoggedInGuard] },
    { path: 'my-events', title: 'My Events | Connect-U', component: MyEventsPageComponent, canActivate: [isLoggedInGuard] },
    { path: 'my-space', title: 'My Space | Connect-U', component: MySpacePageComponent, canActivate: [isLoggedInGuard] },
    { path: 'event/:id', title: 'Event | Connect-U', component: EventDetailPageComponent },
    { path: 'profile/:id', title: 'Profile | Connect-U', component: ProfilePageComponent },

    { path: '**', title: 'Not Found | Connect-U', component: NotFoundPageComponent },
];
