import { Component, Input, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { EventService } from '../../services/event/eventservice';
import { EventDetails } from '../../interfaces/EventDetails';
import { MenuItem, MessageService } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { ToastModule } from 'primeng/toast';
import { TabMenuModule } from 'primeng/tabmenu';
import { Gender, GenderEnum } from '../../interfaces/Gender';
import { EventInfoComponent } from '../../components/event-detail/event-info/event-info.component';
import { AsyncPipe } from '@angular/common';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { EventRequestService } from '../../services/event/event-request.service';
import { AuthService } from '../../services/auth/auth.service';
import { EventUserRequest } from '../../interfaces/EventUserRequest';
import { UsersEventRequest } from '../../interfaces/UsersEventRequest';
import { DialogModule } from 'primeng/dialog';
import { LoginComponent } from '../../components/login/login.component';
import { RegisterComponent } from '../../components/register/register.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProfileData } from '../../interfaces/ProfileData';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';

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
    DialogModule,
    LoginComponent,
    RegisterComponent,
    MultiSelectModule,
    FormsModule,
  ],
})
export class EventPageComponent implements OnInit {
  @Input()
  set id(id: string) {}

  url: string;
  eventId!: string;
  eventDetails!: EventDetails; // Resolved event details
  eventDetails$!: Observable<EventDetails>;
  eventRequestsHost: EventUserRequest[] = [];
  eventTabMenuItems: MenuItem[] = [];
  activeTabItem!: MenuItem;

  friends: ProfileData[] = [];
  selectedFriends: ProfileData[] = [];
  showInviteModal: boolean = false;

  notLoggedInDialogVisible: boolean = false;
  loginRegisterSwitch: boolean = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventService: EventService,
    private readonly translocoService: TranslocoService,
    protected readonly messageService: MessageService,
    protected readonly eventRequestService: EventRequestService,
    protected readonly userService: UserService,
    private auth: AuthService,
  ) {
    this.url = this.router.url;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.url = event.urlAfterRedirects;
        this.setActiveTabItem();
      });

    this.eventId = this.route.snapshot.paramMap.get('id')!;

    this.auth.isLoggedIn().subscribe({
      next: loggedIn => {
        this.notLoggedInDialogVisible = !loggedIn;
      },
      error: err => {
        console.error('Error checking login status:', err);
      },
    });
    if (this.eventId) {
      // Monitor login state

      this.fetchEventDetails();
      this.checkIfComingFromCreate();
    }
  }

  private checkIfComingFromCreate(): void {
    const fromCreate = this.route.snapshot.queryParamMap.get('fromCreate');
    if (fromCreate === 'true') {
      this.loadFriends();
      this.showInviteModal = true;
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
            label: translations['eventPageComponent.chatTab'],
            route: `/event/${this.eventId}/chat`,
            icon: 'chat-3-line',
            state: { eventDetails: this.eventDetails },
            id: 'chatTab',
            command: () => {
              this.onActiveItemChange(this.eventTabMenuItems[1]);
            },
          },
          {
            label: translations['eventPageComponent.listTab'],
            route: `/event/${this.eventId}/lists`,
            icon: 'list-check',
            state: { eventDetails: this.eventDetails },
            id: 'listTab',
            command: () => {
              this.onActiveItemChange(this.eventTabMenuItems[2]);
            },
          },
          {
            label: translations['eventPageComponent.surveyTab'],
            route: `/event/${this.eventId}/surveys`,
            icon: 'chat-poll-line',
            state: { eventDetails: this.eventDetails },
            id: 'surveyTab',
            command: () => {
              this.onActiveItemChange(this.eventTabMenuItems[3]);
            },
          },
        ];
        this.setActiveTabItem();
      });
  }

  protected onActiveItemChange(newActiveItem: MenuItem): void {
    this.activeTabItem = newActiveItem;
  }

  protected getPreferredGendersString = (
    preferredGenders: Gender[],
  ): string => {
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

  protected toggleLoginRegisterSwitch() {
    this.loginRegisterSwitch = !this.loginRegisterSwitch;
  }

  protected onEventDetailsUpdated() {
    this.fetchEventDetails();
  }

  private setActiveTabItem() {
    if (this.router.url.includes('/chat')) {
      this.activeTabItem = this.eventTabMenuItems[1];
    } else if (this.router.url.includes('/lists')) {
      this.activeTabItem = this.eventTabMenuItems[2];
    } else if (this.router.url.includes('/surveys')) {
      this.activeTabItem = this.eventTabMenuItems[3];
    } else {
      this.activeTabItem = this.eventTabMenuItems[0];
    }
  }

  private loadFriends(): void {
    this.friends = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        city: 'Berlin',
        streetNumber: '12',
        birthday: '1990-01-01',
        street: 'Main St',
        zipCode: '10115',
        age: '33',
        pronouns: 'he/him',
        profileText: 'Lorem ipsum',
        gender: 1,
        isUser: false,
        tags: ['tag1'],
        profilePicture: 'john.png',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        city: 'Hamburg',
        streetNumber: '34',
        birthday: '1992-02-02',
        street: 'Second St',
        zipCode: '20144',
        age: '31',
        pronouns: 'she/her',
        profileText: 'Lorem ipsum',
        gender: 2,
        isUser: false,
        tags: ['tag2'],
        profilePicture: 'jane.png',
      },
    ];
  }

  sendInvites(): void {
    const invites = this.selectedFriends.map(friend =>
      this.eventRequestService.createInvite(this.eventId, friend.id).subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: `Invitation sent to ${friend.firstName}`,
          }),
        error: err =>
          this.messageService.add({
            severity: 'error',
            summary: `Failed to send invitation to ${friend.firstName}`,
            detail: err.message,
          }),
      })
    );
    this.showInviteModal = false; // Close modal after sending invites
  }
}
