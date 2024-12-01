import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { async, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventService } from '../../services/event/eventservice';
import { EventDetails } from '../../interfaces/EventDetails';
import { MenuItem, MessageService } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { EventtypeEnum } from '../../interfaces/EventtypeEnum';
import { ToastModule } from 'primeng/toast';
import { TabMenuModule } from 'primeng/tabmenu';
import { Gender, GenderEnum } from '../../interfaces/Gender';
import { EventInfoComponent } from '../../components/event-detail/event-detail/event-info.component';
import { AsyncPipe } from '@angular/common';

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
  selector: 'app-event-page',
  standalone: true,
  templateUrl: './event-page.component.html',
  providers: [MessageService],
  imports: [ToastModule, RouterOutlet, TabMenuModule, EventInfoComponent, AsyncPipe],
})
export class EventPageComponent implements OnInit {
  eventId!: string;
  eventDetails$!: Observable<EventDetails>;
  eventTabMenuItems: MenuItem[] = [];
  isLoggedIn = false;
  isHost = false;
  isGuest = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventService: EventService,
    private readonly translocoService: TranslocoService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    if (this.eventId) {
      console.log('Fetching event details...');
      this.eventDetails$ = this.eventService.getEventDetails(this.eventId).pipe(
        catchError((err) => {
          this.router.navigate(['/404']);
          return throwError(() => err);
        })
      );

      this.eventDetails$.subscribe((details) => {
        this.isHost = true;
        this.isGuest = false;
        this.isLoggedIn = true;

        if (this.isHost || this.isGuest) {
          this.setupTabs();
        }
      });
    }
  }

  private setupTabs(): void {
    this.eventTabMenuItems = [
      {
        label: this.translocoService.translate('eventPageComponent.infoTab'),
        route: `/event/${this.eventId}`,
        icon: 'pi pi-info-circle',
        state: { eventDetails: this.eventDetails$ }, // Pass Observable or raw details
      },
      {
        label: this.translocoService.translate('eventPageComponent.listTab'),
        route: `/event/${this.eventId}/list`,
        icon: 'pi pi-list',
        state: { eventDetails: this.eventDetails$ },
      },
      {
        label: this.translocoService.translate('eventPageComponent.surveyTab'),
        route: `/event/${this.eventId}/survey`,
        icon: 'pi pi-chart-pie',
        state: { eventDetails: this.eventDetails$ },
      },
    ];
  }

  handleEventAction(eventType: EventtypeEnum): void {
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
    this.eventService.addUserToEvent(this.eventId).subscribe({
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
    this.eventService.createJoinRequest(this.eventId).subscribe({
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

  getPreferredGendersString(preferredGenders: Gender[]): string {
    if (!preferredGenders || preferredGenders.length === 0) {
      return this.translocoService.translate(
        'eventDetailPageComponent.noPreferredGenders'
      );
    }

    return preferredGenders
      .map((gender) => {
        switch (gender.gender) {
          case GenderEnum.Male:
            return this.translocoService.translate(
              'eventDetailPageComponent.male'
            );
          case GenderEnum.Female:
            return this.translocoService.translate(
              'eventDetailPageComponent.female'
            );
          case GenderEnum.Diverse:
            return this.translocoService.translate(
              'eventDetailPageComponent.diverse'
            );
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join(', ');
  }

  protected readonly async = async;
}
