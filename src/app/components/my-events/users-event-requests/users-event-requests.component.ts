import { Component, Input } from '@angular/core';
import { UsersEventRequest } from '../../../interfaces/UsersEventRequest';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { HttpClient } from '@angular/common/http';
import { EventRequestService } from '../../../services/event/event-request/event-request.service';

@Component({
  selector: 'app-users-event-requests',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    Button,
    CardModule,
    PrimeTemplate,
    TranslocoPipe,
    RouterLink,
    TranslocoDatePipe,
  ],
  templateUrl: './users-event-requests.component.html',
})
export class UsersEventRequestsComponent {
  @Input() eventRequests!: UsersEventRequest[];

  constructor(
    private http: HttpClient,
    private readonly requestService: EventRequestService,
    private messageService: MessageService,
    private readonly translocoService: TranslocoService) { }


  protected deleteEventRequest(eventTitle: string, requestId: number, $e: MouseEvent): void {
    $e.stopPropagation();
    this.requestService.deleteUserRequest(requestId).subscribe({
      next: () => {
        // Filter out the deleted request
        this.eventRequests = this.eventRequests.filter(request => request.id !== requestId);
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'myEventPageComponent.requests.deleted-request',
            { title: eventTitle }
          ),
        });
      },
      error: (err) => {
        console.error('Error deleting request:', err);
      },
    });
  }

  protected createNewEventRequest(eventTitle: string, eventId: string, $e: MouseEvent): void {
    $e.stopPropagation();
    this.requestService.createJoinRequest(eventId).subscribe({
      next: () => {
        // Finde die Anfrage mit der entsprechenden Event-ID und aktualisiere sie
        const request = this.eventRequests.find(req => req.event.id === eventId);
        if (request) {
          request.denied = false;
        }
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'myEventPageComponent.requests.new-request',
            { title: eventTitle }
          ),
        });
      },
      error: (err) => {
        console.error('Error creating new request:', err);
      },
    });
  }

  protected toDate(date: string): Date {
    return new Date(date);
  }
}
