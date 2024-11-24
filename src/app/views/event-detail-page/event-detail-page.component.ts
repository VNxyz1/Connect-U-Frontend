import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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
  preferredGenders!: Gender[] | null;
  dateAndTime!: string | null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventService: EventService,
    private translocoService: TranslocoService,
  ) {}

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
  }

  handleButtonClick(): void {
    if (this.eventType === EventtypeEnum.public) {
      this.joinPublicEvent();
    } else if (this.eventType === EventtypeEnum.halfPrivate) {
      this.requestToJoinEvent();
    } else if (this.eventType === EventtypeEnum.private) {
      alert(this.translocoService.translate('eventDetailPageComponent.privateEvent'));
    }
  }

  /**
   * Joins a public event directly.
   */
  joinPublicEvent(): void {
    this.eventService.addUserToEvent(this.eventId).subscribe({
      next: response => {
        console.log('Joined public event successfully:', response.message);
        alert(this.translocoService.translate('eventDetailPageComponent.joined'));
      },
      error: err => {
        console.error('Failed to join public event:', err);
        alert(this.translocoService.translate('eventDetailPageComponent.joinError'));
      },
    });
  }

  /**
   * Sends a join request for a half-private event.
   */
  requestToJoinEvent(): void {
    this.eventService.createJoinRequest(this.eventId).subscribe({
      next: response => {
        console.log('Request sent successfully:', response.message);
        alert(this.translocoService.translate('eventDetailPageComponent.requestSent'));
      },
      error: err => {
        console.error('Failed to send join request:', err);
        alert(this.translocoService.translate('eventDetailPageComponent.requestError'));
      },
    });
  }
}
