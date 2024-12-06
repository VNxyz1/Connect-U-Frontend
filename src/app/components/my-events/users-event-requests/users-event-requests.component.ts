import { Component, Input } from '@angular/core';
import { UsersEventRequest } from '../../../interfaces/UsersEventRequest';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PrimeTemplate } from 'primeng/api';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';

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


  protected deleteEventRequest(requestId: number, $e: MouseEvent) {
    $e.stopPropagation();
  }

  protected createNewEventRequest(eventId: string, $e: MouseEvent) {
    $e.stopPropagation();
  }

  protected toDate(date: string): Date {
    return new Date(date);
  }
}
