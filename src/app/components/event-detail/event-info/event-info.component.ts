import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { EventDetails } from '../../../interfaces/EventDetails';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Button } from 'primeng/button';
import { EventtypeEnum } from '../../../interfaces/EventtypeEnum';
import { MessageService } from 'primeng/api';
import { EventService } from '../../../services/event/eventservice';
import { DialogModule } from 'primeng/dialog';
import { LoginComponent } from '../../login/login.component';
import { RegisterComponent } from '../../register/register.component';
import { AuthService } from '../../../services/auth/auth.service';

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
  ],
})
export class EventInfoComponent implements OnInit, OnDestroy {
  eventId!: string;
  private _eventDetailsSubscription: Subscription | undefined ;
  notLoggedInDialogVisible: boolean = false;
  loginRegisterSwitch: boolean = true;

  protected _eventDetails!: EventDetails;
  isLoading = true;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly translocoService: TranslocoService,
    private readonly eventService: EventService,
    private readonly auth: AuthService,
  ) {}

  @Input()
  set eventDetails(value: Observable<EventDetails> | EventDetails) {
    this.handleEventDetailsInput(value);
  }

  @Input() getPreferredGendersString!: (preferredGenders: EventDetails['preferredGenders']) => string;

  get eventDetails(): EventDetails {
    if (!this._eventDetails) {
      throw new Error('Event details are not yet loaded.');
    }
    return this._eventDetails;
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    this.checkLoginStatus();
    // Check if eventDetails is passed via Router state
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState?.['eventDetails']) {
      console.log("Event details from state:", navigationState['eventDetails']);
      this.handleEventDetailsInput(navigationState['eventDetails']);
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this._eventDetailsSubscription?.unsubscribe();
  }

  private handleEventDetailsInput(value: Observable<EventDetails> | EventDetails | null | undefined): void {
    if (!value) {
      console.log("No event details provided.");
      this.navigateTo404();
      return;
    }

    // Unsubscribe any previous subscription
    this._eventDetailsSubscription?.unsubscribe();

    if (value instanceof Observable) {
      console.log("Observable received"); // Observable received
      this.isLoading = true; // Start loading
      this._eventDetailsSubscription = value.subscribe({
        next: (details) => {
          if (!details) {
            console.log("Details are null, navigating to 404");
            this.navigateTo404();
          } else {
            console.log("Details loaded:", details);
            this._eventDetails = this.transformEventDetails(details);
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error("Failed to load event details:", err);
          this.navigateTo404();
        },
      });
    } else {
      console.log("Static details received:", value);
      this._eventDetails = this.transformEventDetails(value);
      this.isLoading = false;
    }
  }

  private navigateTo404(): void {
    //this.router.navigate(['/404']);
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
          'eventDetailPageComponent.privateEvent'
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
            'eventDetailPageComponent.joined'
          ),
        });
      },
      error: (err) => this.handleError(err),
    });
  }

  private requestToJoinEvent(): void {
    this.eventService.createJoinRequest(this.eventDetails.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'eventDetailPageComponent.requestSent'
          ),
        });
      },
      error: (err) => this.handleError(err),
    });
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

  private checkLoginStatus(): void {
    this.auth.isLoggedIn().subscribe({
      next: loggedIn => {
        this.notLoggedInDialogVisible = !loggedIn;
      },
    });
  }

  toggleLoginRegisterSwitch() {
    this.loginRegisterSwitch = !this.loginRegisterSwitch;
  }
}
