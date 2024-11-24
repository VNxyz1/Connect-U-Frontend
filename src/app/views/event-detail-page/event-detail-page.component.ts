import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { ImageModule } from 'primeng/image';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Button } from 'primeng/button';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { EventService } from '../../services/event/eventservice';
import { EventDetails } from '../../interfaces/EventDetails';
import { AsyncPipe } from '@angular/common';
import { Gender, GenderEnum } from '../../interfaces/Gender';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { EventtypeEnum } from '../../interfaces/EventtypeEnum';
import { catchError } from 'rxjs/operators';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [
    ImageModule,
    TranslocoPipe,
    CardModule,
    TagModule,
    Button,
    AngularRemixIconComponent,
    AsyncPipe,
    TranslocoDatePipe,
    ProgressSpinnerModule,
  ],
  templateUrl: './event-detail-page.component.html',
})
export class EventDetailPageComponent implements OnInit {
  eventId!: string;
  eventDetails$!: Observable<EventDetails>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventService: EventService,
    private translocoService: TranslocoService,
  ) {
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    if (this.eventId) {
      this.eventDetails$ = this.eventService.getEventDetails(this.eventId).pipe(
        catchError(err => {
          this.router.navigate(['/404']);
          return throwError(() => err);
        }),
      );
    }
  }

  /**
   * Converts the list of preferred genders for an event to a human-readable string.
   * This method maps gender values (e.g., Male, Female, Diverse) to their localized string representation.
   *
   * @param {Gender[]} preferredGenders - The array of preferred genders for the event.
   * @returns {string} A comma-separated string of the event's preferred genders.
   */
  getPreferredGendersString = (preferredGenders: Gender[]): string => {
    if (!preferredGenders || preferredGenders.length === 0) {
      return '';
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
        }
      })
      .join(', ');
  };

  /**
   * Handles the event type-based logic for joining or requesting to join an event.
   * Depending on the event type, it will either join a public event, send a request to join a half-private event,
   * or alert the user that the event is private.
   *
   * @param {EventtypeEnum} eventType - The type of event (public, half-private, private).
   */
  handleButtonClick(eventType: EventtypeEnum): void {
    if (eventType === EventtypeEnum.public) {
      this.joinPublicEvent();
    } else if (eventType === EventtypeEnum.halfPrivate) {
      this.requestToJoinEvent();
    } else if (eventType === EventtypeEnum.private) {
      alert(this.translocoService.translate('eventDetailPageComponent.privateEvent'));
    }
  }

  /**
   * Adds the current user to the event's participant list if the event is public.
   * It makes a request to the event service to add the user to the event, and displays a success message if successful.
   * In case of an error, it maps the error message to a user-friendly translation and displays it.
   *
   * @returns {Observable} The observable from the event service that handles the user join request.
   */
  joinPublicEvent(): void {
    this.eventService.addUserToEvent(this.eventId).subscribe({
      next: response => {
        console.log('Joined public event successfully:', response.message);
        alert(this.translocoService.translate('eventDetailPageComponent.joined'));
      },
      error: err => {
        console.error('Failed to join public event:', err);

        const translationKey =
          ERROR_MESSAGE_MAPPING[err.error?.message] || 'eventDetailPageComponent.genericError';

        const translatedErrorMessage = this.translocoService.translate(translationKey);
        alert(translatedErrorMessage);
      },
    });
  }

  /**
   * Sends a join request for a half-private event.
   * It makes a request to the event service to create the join request, and displays a success message if successful.
   * In case of an error, it maps the error message to a user-friendly translation and displays it.
   *
   * @returns {Observable} The observable from the event service that handles the join request.
   */
  requestToJoinEvent(): void {
    this.eventService.createJoinRequest(this.eventId).subscribe({
      next: response => {
        console.log('Request sent successfully:', response.message);
        alert(this.translocoService.translate('eventDetailPageComponent.requestSent'));
      },
      error: err => {
        console.error('Failed to send join request:', err);
        const translationKey =
          ERROR_MESSAGE_MAPPING[err.error?.message] || 'eventDetailPageComponent.genericError';

        const translatedErrorMessage = this.translocoService.translate(translationKey);
        alert(translatedErrorMessage);
      },
    });
  }
}

const ERROR_MESSAGE_MAPPING: Record<string, string> = {
  'Event not found': 'eventDetailPageComponent.eventNotFound',
  'user is the host of this event': 'eventDetailPageComponent.userIsHost',
  'Request already exists': 'eventDetailPageComponent.requestAlreadyExists',
  'User is already a participant in this event': 'eventDetailPageComponent.alreadyParticipant',
  'You do not meet the age requirements for this event.': 'eventDetailPageComponent.ageRequirementsNotMet',
  'Your gender does not match the preferred genders for this event.': 'eventDetailPageComponent.genderMismatch',
  'Event has to be public': 'eventDetailPageComponent.eventNotPublic'
};
