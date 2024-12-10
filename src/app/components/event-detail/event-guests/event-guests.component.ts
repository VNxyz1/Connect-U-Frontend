import { Component, Input } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EventUserRequest } from '../../../interfaces/EventUserRequest';
import { EventRequestService } from '../../../services/event/event-request/event-request.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfileData } from '../../../interfaces/ProfileData';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { EventService } from '../../../services/event/eventservice';
import { EventDetails } from '../../../interfaces/EventDetails';
import { ProfileCardComponent } from '../../profile-card/profile-card.component';

@Component({
  selector: 'app-event-guests',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    Button,
    CardModule,
    PrimeTemplate,
    TranslocoPipe,
    RouterLink,
    ProfileCardComponent,
  ],
  templateUrl: './event-guests.component.html',
})
export class EventGuestsComponent {
  eventId!: string;
  protected eventDetails$!: Observable<EventDetails>;
  protected eventDetails!: EventDetails;

  constructor(
    private eventRequestService: EventRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private translocoService: TranslocoService,
    private readonly eventService: EventService,
  ) {
    if (this.route.snapshot.paramMap.get('id')!) {
      this.eventId = this.route.snapshot.paramMap.get('id')!;
    } else {
      this.router.navigate(['/']);
    }
    if (this.eventId) {
      this.fetchEventDetails();
    }
  }

  private fetchEventDetails(): void {
    this.eventDetails$ = this.eventService.getEventDetails(this.eventId).pipe(
      catchError(err => {
        this.router.navigate(['/404']);
        return throwError(() => err);
      }),
    );

    this.eventDetails$.subscribe({
      next: details => {
        this.eventDetails = details;
      },
      error: err => {
        console.error('Error fetching event details:', err);
        this.router.navigate(['/404']);
      },
    });
  }
}
