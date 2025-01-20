import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { GuestEventsComponent } from '../../components/my-events/guest-events/guest-events.component';
import { HostedEventsComponent } from '../../components/my-events/hosted-events/hosted-events.component';
import { FavoriteEventsComponent } from '../../components/my-events/favorite-events/favorite-events.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { UsersEventRequestsComponent } from '../../components/my-events/users-event-requests/users-event-requests.component';
import { EventRequestService } from '../../services/event/event-request.service';
import { UsersEventRequest } from '../../interfaces/UsersEventRequest';
import { CurrentUrlService } from '../../services/current-url/current-url.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { PushNotificationService } from '../../services/push-notification/push-notification.service';

@Component({
  selector: 'app-my-events-page',
  standalone: true,
  imports: [
    TabViewModule,
    GuestEventsComponent,
    HostedEventsComponent,
    FavoriteEventsComponent,
    MultiSelectModule,
    FormsModule,
    FloatLabelModule,
    TabMenuModule,
    UsersEventRequestsComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
  templateUrl: './my-events-page.component.html',
})
export class MyEventsPageComponent implements OnInit {
  activeTab: string = 'guest';
  currentUrl$!: Observable<string>;
  tabMenuItems: MenuItem[] = [];

  filterCategories = [
    { name: 'outdoor' },
    { name: 'indoor' },
    { name: 'music' },
    { name: 'sports' },
    { name: 'gaming' },
    { name: 'eating' },
    { name: 'learning' },
    { name: 'cooking' },
    { name: 'movies' },
    { name: 'adventure' },
    { name: 'party' },
    { name: 'other' },
  ];
  selectedCategories: { name: string }[] = [];

  hasEvents: boolean = false;
  eventRequests: UsersEventRequest[] = [];
  eventRequestsFromFriends: UsersEventRequest[] = [];

  constructor(
    private readonly eventRequestService: EventRequestService,
    private readonly translocoService: TranslocoService,
    private readonly currentUrl: CurrentUrlService,
    protected readonly userService: UserService,
    protected readonly pushNotifications: PushNotificationService,
  ) {
    this.currentUrl$ = this.currentUrl.get();
    this.setupTabItems();
  }

  ngOnInit() {
    this.setupTabItems();

    this.setEventRequests();

    this.eventRequestService.getNewInviteSocket().subscribe({
      next: userId => {
        const a = this.userService.getCurrentUserData();
        if (a?.id == userId) {
          this.setEventRequests();
        }
      },
    });
    this.eventRequestService.getInviteStatusChangeSocket().subscribe({
      next: userId => {
        const a = this.userService.getCurrentUserData();
        if (a?.id == userId) {
          this.setEventRequests();
        }
      },
    });
  }

  private setEventRequests() {
    this.eventRequestService.getUsersRequests().subscribe({
      next: requests => {
        this.eventRequests = requests;
      },
      error: err => {
        console.error('Failed to fetch user requests:', err);
      },
    });
    this.eventRequestService.getInvitationFromFriends().subscribe({
      next: friendRequest => {
        this.eventRequestsFromFriends = friendRequest;
      },
      error: err => {
        console.error('Failed to fetch requests from Friends:', err);
      },
    });
  }

  private setupTabItems() {
    this.translocoService
      .selectTranslation()
      .subscribe((translations: Record<string, string>) => {
        this.tabMenuItems = [
          {
            label: translations['myEventPageComponent.guest.title'],
            command: () => this.setActiveTab('guest'),
            iBadge: 'guest',
          },
          {
            label: translations['myEventPageComponent.hosted.title'],
            command: () => this.setActiveTab('hosted'),
            iBadge: 'host',
          },
          // Commented out the favorite tab item
          /*
          {
            label: translations['myEventPageComponent.favorite.title'],
            icon: 'pi pi-star',
            command: () => this.setActiveTab('favorite'),
          },
          */
        ];
      });
  }

  getBadgeValue(key: 'guest' | 'host') {
    switch (key) {
      case 'guest':
        return this.pushNotifications.getMyEventsGuest();
      case 'host':
        return this.pushNotifications.getMyEventsHost();
      default:
        return of(0);
    }
  }

  doesNotInclude(segment: string, currentUrl: string): boolean {
    return !currentUrl.includes(segment);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.resetHasEvents();
  }

  updateHasEvents(status: boolean): void {
    this.hasEvents = status;
  }

  resetHasEvents(): void {
    this.hasEvents = false;
  }
}
