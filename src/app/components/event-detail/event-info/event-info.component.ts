import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { EventDetails } from '../../../interfaces/EventDetails';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Button } from 'primeng/button';
import { EventtypeEnum } from '../../../interfaces/EventtypeEnum';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventService } from '../../../services/event/eventservice';
import { DialogModule } from 'primeng/dialog';
import { LoginComponent } from '../../login/login.component';
import { RegisterComponent } from '../../register/register.component';
import { AuthService } from '../../../services/auth/auth.service';
import { EventRequestService } from '../../../services/event/event-request/event-request.service';
import { EventUserRequest } from '../../../interfaces/EventUserRequest';
import { UsersEventRequest } from '../../../interfaces/UsersEventRequest';
import { AsyncPipe } from '@angular/common';
import { EventStatusIndicatorComponent } from '../../event-status-indicator/event-status-indicator.component';
import { ProfileCardComponent } from '../../profile-card/profile-card.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

const ERROR_MESSAGE_MAPPING: Record<string, string> = {
  'Event not found': 'eventDetailPageComponent.eventNotFound',
  'Host cannot send a join request to their own event':
    'eventDetailPageComponent.userIsHost',
  'user is the host of this event': 'eventDetailPageComponent.userIsHost',
  'Request already exists': 'eventDetailPageComponent.requestAlreadyExists',
  'User is already a participant in this event':
    'eventDetailPageComponent.alreadyParticipant',
  'You do not meet the age requirements for this event.':
    'eventDetailPageComponent.ageRequirementsNotMet',
  'Your gender does not match the preferred genders for this event.':
    'eventDetailPageComponent.genderMismatch',
  'Event has to be public': 'eventDetailPageComponent.eventNotPublic',
};

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  standalone: true,
  imports: [
    ImageModule,
    TranslocoPipe,
    TranslocoDatePipe,
    AngularRemixIconComponent,
    CardModule,
    TagModule,
    ProgressSpinnerModule,
    Button,
    DialogModule,
    LoginComponent,
    RegisterComponent,
    RouterLink,
    AsyncPipe,
    EventStatusIndicatorComponent,
    ProfileCardComponent,
    ConfirmDialogModule,
  ],
})
export class EventInfoComponent implements OnInit, OnDestroy {
  userRequest: UsersEventRequest | null = null;
  private userRequestSubscription!: Subscription;
  @Input() eventRequestsHost: EventUserRequest[] = [];
  @Input()
  set eventDetails(value: Observable<EventDetails> | EventDetails) {
    this.handleEventDetailsInput(value);
  }

  @Input() getPreferredGendersString!: (
    preferredGenders: EventDetails['preferredGenders'],
  ) => string;
  eventId!: string;
  private _eventDetailsSubscription: Subscription | undefined;
  notLoggedInDialogVisible: boolean = false;
  loginRegisterSwitch: boolean = true;

  protected _eventDetails!: EventDetails;
  isLoading = true;

  constructor(
    private readonly router: Router,
    protected readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly translocoService: TranslocoService,
    private readonly eventService: EventService,
    private readonly auth: AuthService,
    private readonly eventRequestService: EventRequestService,
    private readonly confirmationService: ConfirmationService,
  ) {}

  get eventDetails(): EventDetails {
    if (!this._eventDetails) {
      throw new Error('Event details are not yet loaded.');
    }
    return this._eventDetails;
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    // Subscribe to login status changes
    this.auth.isLoggedIn().subscribe({
      next: loggedIn => {
        this.notLoggedInDialogVisible = !loggedIn;
      },
      error: err => {
        console.error('Error checking login status:', err);
      },
    });

    // Check if eventDetails is passed via Router state
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState?.['eventDetails']) {
      this.handleEventDetailsInput(navigationState['eventDetails']);
    }
  }

  private fetchUserRequest(): void {
    if (!this.eventId) {
      return;
    }

    this.userRequestSubscription = this.eventRequestService
      .getUserRequestForEvent(this.eventId)
      .subscribe({
        next: request => {
          this.userRequest = request;
        },
        error: err => {
          console.error('Error fetching user request:', err);
          this.userRequest = null; // Reset in case of error
        },
      });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this._eventDetailsSubscription?.unsubscribe();
    this.userRequestSubscription?.unsubscribe();
  }

  private handleEventDetailsInput(
    value: Observable<EventDetails> | EventDetails | null | undefined,
  ): void {
    if (!value) {
      this.navigateTo404();
      return;
    }

    // Unsubscribe any previous subscription
    this._eventDetailsSubscription?.unsubscribe();

    if (value instanceof Observable) {
      this.isLoading = true; // Start loading
      this._eventDetailsSubscription = value.subscribe({
        next: details => {
          if (!details) {
            this.navigateTo404();
          } else {
            this._eventDetails = this.transformEventDetails(details);
            this.isLoading = false;
            if (!this.eventDetails.isHost) {
              this.fetchUserRequest();
            }
          }
        },
        error: err => {
          this.navigateTo404();
        },
      });
    } else {
      this._eventDetails = this.transformEventDetails(value);
      this.isLoading = false;
    }
  }

  private navigateTo404(): void {
    this.router.navigate(['/404']);
  }

  /**
   * Transform the EventDetails if needed.
   * @param details The EventDetails to transform.
   * @returns Transformed EventDetails.
   */
  private transformEventDetails(details: EventDetails): EventDetails {
    // Perform any transformations on the details here
    return details;
  }

  handleButtonClick(eventType: EventtypeEnum): void {
    if (eventType === EventtypeEnum.public) {
      this.joinPublicEvent();
    } else if (eventType === EventtypeEnum.halfPrivate) {
      this.requestToJoinEvent();
    } else if (eventType === EventtypeEnum.private) {
      this.messageService.add({
        severity: 'info',
        summary: this.translocoService.translate(
          'eventDetailPageComponent.privateEvent',
        ),
      });
    }
  }

  private joinPublicEvent(): void {
    this.eventService.addUserToEvent(this.eventDetails.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'eventDetailPageComponent.joined',
          ),
        });
        this.fetchUserRequest();
      },
      error: err => this.handleError(err),
    });
  }

  private requestToJoinEvent(): void {
    if (this.eventId) {
      this.eventRequestService.createJoinRequest(this.eventId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'eventDetailPageComponent.requestSent',
            ),
          });
          this.fetchUserRequest();
        },
        error: err => this.handleError(err),
      });
    }
  }

  private handleError(err: any): void {
    const translationKey =
      ERROR_MESSAGE_MAPPING[err.error?.message] ||
      'eventDetailPageComponent.genericError';

    const translatedMessage = this.translocoService.translate(translationKey);

    this.messageService.add({
      severity: 'error',
      summary: translatedMessage,
    });
  }

  toggleLoginRegisterSwitch() {
    this.loginRegisterSwitch = !this.loginRegisterSwitch;
  }

  deleteEventRequest(id: number, $e: MouseEvent) {
    $e.stopPropagation();
    this.eventRequestService.deleteUserRequest(id).subscribe({
      next: () => {
        // Filter out the deleted request
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'eventDetailPageComponent.request-deleted',
          ),
        });
        this.fetchUserRequest();
      },
      error: err => {
        console.error('Error deleting request:', err);
      },
    });
  }

  protected cancelEventParticipation($e: MouseEvent) {
    $e.stopPropagation();
    this.confirmationService.confirm({
      message: this.translocoService.translate(
        'eventDetailPageComponent.messages.cancelParticipation',
      ),
      header: this.translocoService.translate(
        'headerComponent.messages.cancelParticipationHeader',
      ),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eventService.deleteEventParticipation(this.eventId).subscribe({
          next: () => {
            // Filter out the deleted request
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate(
                'eventDetailPageComponent.participationCanceled',
              ),
            });
          },
          error: err => {
            console.error('Error deleting request:', err);
          },
        });
      },
      reject: () => {
        return;
      },
    });
  }
}
