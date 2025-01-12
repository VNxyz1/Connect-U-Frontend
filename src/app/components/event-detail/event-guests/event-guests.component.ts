import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { EventService } from '../../../services/event/eventservice';
import { EventDetails } from '../../../interfaces/EventDetails';
import { ProfileCardComponent } from '../../profile-card/profile-card.component';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-event-guests',
  standalone: true,
  imports: [CardModule, TranslocoPipe, ProfileCardComponent, AvatarGroupModule],
  templateUrl: './event-guests.component.html',
})
export class EventGuestsComponent {
  eventId!: string;
  protected eventDetails$!: Observable<EventDetails>;
  protected eventDetails!: EventDetails;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
