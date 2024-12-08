import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  of,
  Subscription,
  throwError,
} from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { EventService } from '../../services/event/eventservice';
import { EventDetails } from '../../interfaces/EventDetails';
import { MenuItem, MessageService } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { EventtypeEnum } from '../../interfaces/EventtypeEnum';
import { ToastModule } from 'primeng/toast';
import { TabMenuModule } from 'primeng/tabmenu';
import { Gender, GenderEnum } from '../../interfaces/Gender';
import { EventInfoComponent } from '../../components/event-detail/event-info/event-info.component';
import { AsyncPipe } from '@angular/common';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { EventRequestService } from '../../services/event/event-request/event-request.service';
import { AuthService } from '../../services/auth/auth.service';
import { EventUserRequest } from '../../interfaces/EventUserRequest';
import { UsersEventRequest } from '../../interfaces/UsersEventRequest';

@Component({
  selector: 'app-event-page',
  standalone: true,
  templateUrl: './event-page.component.html',
  imports: [
    ToastModule,
    RouterOutlet,
    TabMenuModule,
    EventInfoComponent,
    AsyncPipe,
    AngularRemixIconComponent,
  ],
})
export class EventPageComponent implements OnInit {
  url: string;
  eventId!: string;
  eventDetails!: EventDetails; // Resolved event details
  eventDetails$!: Observable<EventDetails>;
  eventRequestsHost: EventUserRequest[] = [];
  eventTabMenuItems: MenuItem[] = [];
  activeTabItem!: MenuItem;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventService: EventService,
    private readonly translocoService: TranslocoService,
    protected readonly messageService: MessageService,
    protected readonly eventRequestService: EventRequestService,
    private auth: AuthService,
  ) {
    this.url = this.router.url;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.url = event.urlAfterRedirects;
      });

    this.eventId = this.route.snapshot.paramMap.get('id')!;
    if (this.eventId) {
      // Monitor login state
      this.auth.isLoggedIn().subscribe({
        next: loggedIn => {
          if (loggedIn) {
            this.fetchEventDetails();
          } else {
            this.clearEventState();
          }
        },
        error: err => console.error('Error checking login status:', err),
      });
    }
  }

  private fetchEventDetails(): void {
    this.eventDetails$ = this.eventService.getEventDetails(this.eventId).pipe(
      catchError(err => {
        this.router.navigate(['/404']);
        return throwError(() => err);
      }),
    );

    // Subscribe to the event details observable
    this.eventDetails$.subscribe({
      next: details => {
        this.eventDetails = details;
        if (this.eventDetails.isHost || this.eventDetails.isParticipant) {
          this.setupTabs();
          this.fetchEventRequestsHost();
        }
      },
      error: err => {
        console.error('Error fetching event details:', err);
        this.router.navigate(['/404']);
      },
    });
  }

  private fetchEventRequestsHost(): void {
    if (!this.eventId || !this.eventDetails.isHost) {
      return;
    }

    this.eventRequestService.getEventHostRequests(this.eventId).subscribe({
      next: requests => {
        this.eventRequestsHost = requests;
      },
      error: err => {
        console.error('Error fetching event requests:', err);
      },
    });
  }

  private clearEventState(): void {
    this.eventDetails = undefined!;
    this.eventTabMenuItems = [];
    this.eventRequestsHost = [];
  }

  private setupTabs(): void {
    this.translocoService
      .selectTranslation()
      .subscribe((translations: Record<string, string>) => {
        this.eventTabMenuItems = [
          {
            label: translations['eventPageComponent.infoTab'],
            route: `/event/${this.eventId}`,
            icon: 'folder-info-line',
            state: { eventDetails: this.eventDetails },
            id: 'infoTab',
            command: () => {
              this.onActiveItemChange(this.eventTabMenuItems[0]);
            },
          },
          {
            label: translations['eventPageComponent.listTab'],
            route: `/event/${this.eventId}/lists`,
            icon: 'list-check',
            state: { eventDetails: this.eventDetails },
            id: 'listTab',
            command: () => {
              this.onActiveItemChange(this.eventTabMenuItems[1]);
            },
          },
          {
            label: translations['eventPageComponent.surveyTab'],
            route: `/event/${this.eventId}/surveys`,
            icon: 'chat-poll-line',
            state: { eventDetails: this.eventDetails },
            id: 'surveyTab',
            command: () => {
              this.onActiveItemChange(this.eventTabMenuItems[2]);
            },
          },
        ];
        if (this.router.url.includes('/lists')) {
          this.activeTabItem = this.eventTabMenuItems[1];
        } else if (this.router.url.includes('/surveys')) {
          this.activeTabItem = this.eventTabMenuItems[2];
        } else {
          this.activeTabItem = this.eventTabMenuItems[0];
        }
      });
  }

  protected onActiveItemChange(newActiveItem: MenuItem): void {
    this.activeTabItem = newActiveItem;

  }

  getPreferredGendersString = (preferredGenders: Gender[]): string => {
    if (!preferredGenders || preferredGenders.length === 0) {
      return this.translocoService.translate(
        'eventDetailPageComponent.noPreferredGenders',
      );
    }

    return preferredGenders
      .map(gender => {
        switch (gender.gender) {
          case GenderEnum.Male:
            return this.translocoService.translate(
              'eventDetailPageComponent.male',
            );
          case GenderEnum.Female:
            return this.translocoService.translate(
              'eventDetailPageComponent.female',
            );
          case GenderEnum.Diverse:
            return this.translocoService.translate(
              'eventDetailPageComponent.diverse',
            );
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join(', ');
  };

}
