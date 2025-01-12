import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { map, Observable, of, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { EventService } from '../../services/event/eventservice';
import { EventDetails } from '../../interfaces/EventDetails';
import { MenuItem, MessageService } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ToastModule } from 'primeng/toast';
import { TabMenuModule } from 'primeng/tabmenu';
import { Gender, GenderEnum } from '../../interfaces/Gender';
import { EventInfoComponent } from '../../components/event-detail/event-info/event-info.component';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { EventRequestService } from '../../services/event/event-request.service';
import { AuthService } from '../../services/auth/auth.service';
import { EventUserRequest } from '../../interfaces/EventUserRequest';
import { DialogModule } from 'primeng/dialog';
import { LoginComponent } from '../../components/login/login.component';
import { RegisterComponent } from '../../components/register/register.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProfileData } from '../../interfaces/ProfileData';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { FriendsService } from '../../services/friends/friends.service';

@Component({
  selector: 'app-event-page',
  standalone: true,
  templateUrl: './event-page.component.html',
  imports: [
    ToastModule,
    RouterOutlet,
    TabMenuModule,
    EventInfoComponent,
    AngularRemixIconComponent,
    DialogModule,
    LoginComponent,
    RegisterComponent,
    MultiSelectModule,
    FormsModule,
    Button,
    TranslocoPipe,
    ListboxModule,
    ChipModule,
    ChipsModule,
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
  eventInvitesHost: EventUserRequest[] = [];
  eventTabMenuItems: MenuItem[] = [];
  activeTabItem!: MenuItem;

  friends: ProfileData[] = [];
  selectedFriends: ProfileData[] = [];
  showInviteModal: boolean = false;

  notLoggedInDialogVisible: boolean = false;
  loginRegisterSwitch: boolean = true;

  selectedFriendsChange = new EventEmitter<any[]>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventService: EventService,
    private readonly translocoService: TranslocoService,
    protected readonly messageService: MessageService,
    protected readonly eventRequestService: EventRequestService,
    protected readonly userService: UserService,
    private readonly friendsService: FriendsService,
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
      this.selectedFriendsChange.subscribe(updatedFriends => {
        // Update selectedFriends and ensure synchronization
        this.selectedFriends = updatedFriends;
      });
    }
  }

  private checkIfComingFromCreate(): void {
    const fromCreate = this.route.snapshot.queryParamMap.get('fromCreate');
    if (fromCreate === 'true') {
      this.openInviteDialog(false);
    }
  }

  protected openInviteDialog(buttonClicked: boolean): void {
    const maxNumberUnreached =
      this.eventDetails.maxParticipantsNumber -
        this.eventDetails.participantsNumber >
      0;

    this.loadFriends().subscribe(hasFittingFriends => {
      if (hasFittingFriends && maxNumberUnreached) {
        this.showInviteModal = true;
      } else if (buttonClicked) {
        const messageKey = maxNumberUnreached
          ? 'eventPageComponent.friends.noFriendsToInvite'
          : 'eventPageComponent.friends.maxNumberExceeded';

        this.messageService.add({
          severity: 'info',
          summary: this.translocoService.translate(messageKey),
        });
      }
    });
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
          setTimeout(() => {
            this.fetchEventInvitesHost();
          }, 100);
        }
      },
      error: err => {
        console.error('Error fetching event details:', err);
        this.router.navigate(['/404']);
      },
    });
  }

  onSelectedFriendsChange(): void {
    // Create a new reference with only valid friends
    this.selectedFriends = this.selectedFriends.filter(friend =>
      this.friends.some(f => f.id === friend.id),
    );
    // Emit the updated list
    this.selectedFriendsChange.emit([...this.selectedFriends]);
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

  private fetchEventInvitesHost(): void {
    if (!this.eventId || !this.eventDetails.isHost) {
      return;
    }

    this.eventRequestService.getAllInvitesForEvent(this.eventId).subscribe({
      next: data => {
        this.eventInvitesHost = data;
      },
      error: err => {
        console.error('Error fetching event requests:', err);
      },
    });
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

  private loadFriends(): Observable<boolean> {
    return this.friendsService.getFilteredFriendsForEvent(this.eventId).pipe(
      map(data => {
        this.friends = data;
        return this.friends.length > 0; // Return true if there are friends
      }),
      catchError(err => {
        console.error('Error fetching friends:', err);
        this.router.navigate(['/404']);
        return of(false); // Return false if there’s an error
      }),
    );
  }

  protected toggleMultiSelection(friend: any): void {
    const index = this.selectedFriends.findIndex(f => f.id === friend.id);
    if (index === -1) {
      this.selectedFriends.push(friend);
    } else {
      this.selectedFriends.splice(index, 1);
    }
  }

  protected sendInvites(): void {
    this.selectedFriends.map(friend =>
      this.eventRequestService.createInvite(this.eventId, friend.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'eventPageComponent.friends.inviteSuccess',
              { name: friend.firstName },
            ),
          });
          this.onEventDetailsUpdated();
          this.fetchEventDetails();
          this.selectedFriends = [];
        },
        error: err =>
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate(
              'eventPageComponent.friends.inviteError',
              { name: friend.firstName },
            ),
          }),
      }),
    );
    this.showInviteModal = false; // Close modal after sending invites
    this.onInviteDialogClose();
  }

  protected checkMaxSelection(): void {
    if (
      this.selectedFriends.length >
      this.eventDetails.maxParticipantsNumber -
        this.eventDetails.participantsNumber
    ) {
      // Remove the last selected friend if the limit is exceeded
      this.selectedFriends.pop();

      // Display a warning message with a higher z-index
      this.messageService.add({
        severity: 'warning',
        summary: this.translocoService.translate(
          'eventPageComponent.friends.maxNumberExceeded',
        ),
      });

      this.selectedFriendsChange.emit(this.selectedFriends);
    }
  }

  onInviteDialogClose() {
    const queryParams = { ...this.route.snapshot.queryParams };

    if (queryParams['fromCreate']) {
      delete queryParams['fromCreate'];

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        replaceUrl: true,
      });
    }
  }
}
