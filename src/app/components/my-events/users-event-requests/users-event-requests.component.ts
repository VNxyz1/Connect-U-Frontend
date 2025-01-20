import { Component, Input, OnInit } from '@angular/core';
import { UsersEventRequest } from '../../../interfaces/UsersEventRequest';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { EventRequestService } from '../../../services/event/event-request.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PushNotificationService } from '../../../services/push-notification/push-notification.service';
import { UserService } from '../../../services/user/user.service';
import { EventService } from '../../../services/event/eventservice';
import { EventDetails } from '../../../interfaces/EventDetails';

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
    AsyncPipe,
  ],
  templateUrl: './users-event-requests.component.html',
})
export class UsersEventRequestsComponent implements OnInit {
  @Input() eventRequests!: UsersEventRequest[];
  invites$!: Observable<UsersEventRequest[]>;

  constructor(
    private readonly requestService: EventRequestService,
    private messageService: MessageService,
    private readonly translocoService: TranslocoService,
    private pushNotificationService: PushNotificationService,
    protected readonly userService: UserService,
    protected router: Router,
    protected eventService: EventService,
  ) {}
  ngOnInit() {
    this.loadInvites();
  }

  protected loadInvites() {
    this.invites$ = this.requestService.getInvitationFromFriends();
  }
  protected deleteEventRequest(
    eventTitle: string,
    requestId: number,
    $e: MouseEvent,
  ): void {
    $e.stopPropagation();
    this.requestService.deleteUserRequest(requestId).subscribe({
      next: () => {
        // Filter out the deleted request
        this.eventRequests = this.eventRequests.filter(
          request => request.id !== requestId,
        );
        this.pushNotificationService.loadEventRequestNotifications();
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'myEventPageComponent.requests.deleted-request',
            { title: eventTitle },
          ),
        });
      },
      error: err => {
        console.error('Error deleting request:', err);
      },
    });
  }

  protected createNewEventRequest(
    eventTitle: string,
    eventId: string,
    $e: MouseEvent,
  ): void {
    $e.stopPropagation();
    this.requestService.createJoinRequest(eventId).subscribe({
      next: () => {
        // Finde die Anfrage mit der entsprechenden Event-ID und aktualisiere sie
        const request = this.eventRequests.find(
          req => req.event.id === eventId,
        );
        if (request) {
          request.denied = false;
        }
        this.pushNotificationService.loadEventRequestNotifications();
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'myEventPageComponent.requests.new-request',
            { title: eventTitle },
          ),
        });
      },
      error: err => {
        console.error('Error creating new request:', err);
      },
    });
  }

  protected denyFriendsRequestedEvent(inviteID: number) {
    this.requestService.denyFriendsRequest(inviteID).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate('inviteByFriends.denyTitle'),
          detail: this.translocoService.translate(
            'inviteByFriends.denyMessage',
          ),
        });
        this.loadInvites();
      },
      error: err => {
        console.error('Error denying invitation:', err);
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'eventInvite.deny.errorTitle',
          ),
          detail: this.translocoService.translate(
            'eventInvite.deny.errorMessage',
          ),
        });
      },
    });
  }

  protected acceptFriendsRequestedEvent(inviteID: number, event: EventDetails) {
    this.requestService.acceptFriendsRequest(inviteID).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'inviteByFriends.acceptTitle',
          ),
          detail: this.translocoService.translate(
            'inviteByFriends.acceptDetail',
            { title: event.title },
          ),
        });
        this.router.navigate(['/event', event.id]);
      },
      error: err => {
        console.error('Error denying invitation:', err);
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'eventInvite.deny.errorTitle',
          ),
          detail: this.translocoService.translate(
            'eventInvite.deny.errorMessage',
          ),
        });
      },
    });
  }

  protected toDate(date: string): Date {
    return new Date(date);
  }
}
