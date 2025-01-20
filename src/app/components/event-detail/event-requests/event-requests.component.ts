import { Component, OnInit } from '@angular/core';
import { EventUserRequest } from '../../../interfaces/EventUserRequest';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CardModule } from 'primeng/card';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EventRequestService } from '../../../services/event/event-request.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { PushNotificationService } from '../../../services/push-notification/push-notification.service';
import { forkJoin, Observable, tap } from 'rxjs';
import { UserService } from '../../../services/user/user.service';

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
export class EventRequestsComponent implements OnInit {
  eventId!: string;
  protected eventRequests: EventUserRequest[] = [];
  protected eventInvites: EventUserRequest[] = [];

  constructor(
    protected userService: UserService,
    private readonly eventRequestService: EventRequestService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly translocoService: TranslocoService,
    private readonly pushNotificationService: PushNotificationService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventId = id;
    } else {
      this.router.navigate(['/']);
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.eventId) {
      forkJoin({
        requests: this.fetchRequests(this.eventId),
        invites: this.fetchInvites(this.eventId),
      }).subscribe({
        next: ({ requests, invites }) => {
          this.eventRequests = requests;
          this.eventInvites = invites;

          if (
            this.eventInvites.length === 0 &&
            this.eventRequests.length === 0
          ) {
            this.router.navigate([`/event/${this.eventId}`]); // Redirect if both are empty
          }
        },
        error: err => {
          console.error('Error fetching data:', err);
        },
      });
    }
  }

  fetchRequests(eventId: string): Observable<EventUserRequest[]> {
    return this.eventRequestService.getEventHostRequests(eventId).pipe(
      tap(requests => {
        this.eventRequests = requests; // Populate eventRequests
      }),
    );
  }

  fetchInvites(eventId: string): Observable<EventUserRequest[]> {
    return this.eventRequestService.getAllInvitesForEvent(eventId).pipe(
      tap(invites => {
        this.eventInvites = invites; // Populate eventInvites
      }),
    );
  }

  protected denyRequest(
    firstname: string,
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
        this.pushNotificationService.loadEventRequestNotifications();
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'eventDetailPageComponent.requests.denied-request',
            { name: firstname },
          ),
        });
        this.checkAndRedirectToInfo();
      },
      error: err => {
        console.error('Error denying request:', err);
      },
    });
  }

  protected acceptRequest(
    firstname: string,
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
        this.pushNotificationService.loadEventRequestNotifications();
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'eventDetailPageComponent.requests.accepted-request',
            { name: firstname },
          ),
        });
        this.checkAndRedirectToInfo();
      },
      error: err => {
        console.error('Error accepting request:', err);
      },
    });
  }

  deleteInvite(firstname: string, id: number, e: MouseEvent) {
    e.stopPropagation();
    this.eventRequestService.deleteEventInvite(id).subscribe({
      next: () => {
        // Remove the denied request from the array
        this.eventInvites = this.eventInvites.filter(
          invite => invite.id !== id,
        );
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'eventDetailPageComponent.requests.deleted-invite',
            { name: firstname },
          ),
        });
        this.checkAndRedirectToInfo();
      },
      error: err => {
        console.error('Error denying request:', err);
      },
    });
  }

  private checkAndRedirectToInfo(): void {
    if (this.eventRequests.length === 0 && this.eventInvites.length === 0) {
      this.router.navigate([`/event/${this.eventId}`]);
    }
  }
}
