import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { interval, Observable, of, Subscription } from 'rxjs';
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
import { SkeletonModule } from 'primeng/skeleton';

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
    RouterLink,
    EventStatusIndicatorComponent,
    ProfileCardComponent,
    ConfirmDialogModule,
    SkeletonModule,
  ],
  providers: [ConfirmationService],
})
export class EventInfoComponent implements OnInit, OnDestroy {
  userRequest: UsersEventRequest | null = null;
  curDate: Date = new Date();
  private dateSubscription!: Subscription;
  eventDate!: Date;
  private userRequestSubscription!: Subscription;
  @Input() eventRequestsHost: EventUserRequest[] = [];
  @Output() eventDetailsUpdated = new EventEmitter<void>(); // Notify parent

  @Input() getPreferredGendersString!: (
    preferredGenders: EventDetails['preferredGenders'],
  ) => string;
  eventId!: string;
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

    //update curDate every 30 secs
    this.dateSubscription = interval(30000).subscribe(() => {
      this.curDate = new Date();
    });

    this.getEventDetails();
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
    this.userRequestSubscription?.unsubscribe();
    this.dateSubscription?.unsubscribe();
  }

  private getEventDetails(): void {
    if (!this.eventId) {
      this.navigateTo404();
      return;
    }
    this.eventService.getEventDetails(this.eventId).subscribe({
      next: details => {
        this._eventDetails = details;
        this.fetchUserRequest();
        this.isLoading = false;
        this.eventDate = new Date(details.dateAndTime);
        this.eventDetailsUpdated.emit();
      },
      error: err => this.handleError(err),
    });
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
    if (
      this.eventDetails &&
      this.eventDetails &&
      this.eventDetails.status != 3 &&
      this.eventDetails.status != 4
    )
      this.eventService.addUserToEvent(this.eventDetails.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'eventDetailPageComponent.joined',
            ),
          });
          this.fetchUserRequest();
          this.getEventDetails();
        },
        error: err => this.handleError(err),
      });
  }

  private requestToJoinEvent(): void {
    if (
      this.eventId &&
      this.eventDetails &&
      this.eventDetails.status != 3 &&
      this.eventDetails.status != 4 &&
      this.curDate &&
      this.eventDate &&
      this.curDate < this.eventDate
    ) {
      this.eventRequestService.createJoinRequest(this.eventId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'eventDetailPageComponent.requestSent',
            ),
          });
          this.fetchUserRequest();
          this.getEventDetails();
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
        this.getEventDetails();
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
        'eventDetailPageComponent.messages.cancelParticipationHeader',
      ),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eventService.removeEventParticipation(this.eventId).subscribe({
          next: () => {
            // Filter out the deleted request
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate(
                'eventDetailPageComponent.messages.participationCanceled',
              ),
            });
            this.getEventDetails();
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
