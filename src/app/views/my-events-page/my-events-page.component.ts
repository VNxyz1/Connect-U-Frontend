import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TranslocoService } from '@jsverse/transloco';
import { GuestEventsComponent } from '../../components/my-events/guest-events/guest-events.component';
import { HostedEventsComponent } from '../../components/my-events/hosted-events/hosted-events.component';
import { FavoriteEventsComponent } from '../../components/my-events/favorite-events/favorite-events.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UsersEventRequestsComponent } from '../../components/my-events/users-event-requests/users-event-requests.component';
import { EventRequestService } from '../../services/event/event-request.service';
import { UsersEventRequest } from '../../interfaces/UsersEventRequest';

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
  ],
  templateUrl: './my-events-page.component.html',
})
export class MyEventsPageComponent implements OnInit {
  activeTab: string = 'guest';
  currentUrl: string = '';
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

  constructor(
    private router: Router,
    private readonly eventRequestService: EventRequestService,
    private readonly translocoService: TranslocoService,
  ) {
    this.currentUrl = this.router.url;
    this.setupTabItems();
  }

  ngOnInit() {
    this.setupTabItems();
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });

    this.eventRequestService.getUsersRequests().subscribe({
      next: requests => {
        this.eventRequests = requests;
      },
      error: err => {
        console.error('Failed to fetch user requests:', err);
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
            icon: 'pi pi-users',
            command: () => this.setActiveTab('guest'),
          },
          {
            label: translations['myEventPageComponent.hosted.title'],
            icon: 'pi pi-plus-circle',
            command: () => this.setActiveTab('hosted'),
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

  doesNotInclude(segment: string): boolean {
    return !this.currentUrl.includes(segment);
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
