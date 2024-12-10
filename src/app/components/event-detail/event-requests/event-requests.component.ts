import { Component, Input } from '@angular/core';
import { EventUserRequest } from '../../../interfaces/EventUserRequest';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CardModule } from 'primeng/card';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EventRequestService } from '../../../services/event/event-request/event-request.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-event-requests',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    CardModule,
    TranslocoPipe,
    Button,
    RouterLink,
  ],
  templateUrl: './event-requests.component.html',
})
export class EventRequestsComponent {
  eventId!: string;
  protected eventRequests: EventUserRequest[] = [];

  constructor(
    private eventRequestService: EventRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private translocoService: TranslocoService,
  ) {
    if (this.route.snapshot.paramMap.get('id')!) {
      this.eventId = this.route.snapshot.paramMap.get('id')!;
    } else {
      this.router.navigate(['/']);
    }
    if (this.eventId) {
      this.fetchRequests(this.eventId);
    }
  }

  private fetchRequests(eventId: string): void {
    this.eventRequestService.getEventHostRequests(eventId).subscribe({
      next: requests => {
        this.eventRequests = requests;
      },
      error: err => {
        console.error('Error fetching event requests:', err);
      },
    });
  }

  protected denyRequest(
    username: string,
    requestId: number,
    e: MouseEvent,
  ): void {
    e.stopPropagation();
    this.eventRequestService.denyUserRequest(requestId).subscribe({
      next: () => {
        // Remove the denied request from the array
        this.eventRequests = this.eventRequests.filter(
          request => request.id !== requestId,
        );
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'eventDetailPageComponent.requests.denied-request',
            { name: username },
          ),
        });
      },
      error: err => {
        console.error('Error denying request:', err);
      },
    });
  }

  protected acceptRequest(
    username: string,
    requestId: number,
    e: MouseEvent,
  ): void {
    e.stopPropagation();
    this.eventRequestService.acceptUserRequest(requestId).subscribe({
      next: () => {
        // Remove the denied request from the array
        this.eventRequests = this.eventRequests.filter(
          request => request.id !== requestId,
        );
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'eventDetailPageComponent.requests.accepted-request',
            { name: username },
          ),
        });
      },
      error: err => {
        console.error('Error accepting request:', err);
      },
    });
  }
}
