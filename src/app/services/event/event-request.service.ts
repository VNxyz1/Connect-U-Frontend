import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EventUserRequest } from '../../interfaces/EventUserRequest';
import { UsersEventRequest } from '../../interfaces/UsersEventRequest';
import { SocketService } from '../socket/socket.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class EventRequestService {
  private readonly newInviteSocket$!: Observable<string>;
  private readonly inviteStatusChangeSocket$!: Observable<string>;

  private readonly invitesSubject$ = new BehaviorSubject<UsersEventRequest[]>(
    [],
  );
  private readonly eventRequestsSubject$ = new BehaviorSubject<
    UsersEventRequest[]
  >([]);

  constructor(
    private readonly http: HttpClient,
    private readonly socket: SocketService,
    private readonly userService: UserService,
  ) {
    this.newInviteSocket$ = this.socket.on('newInvite');
    this.inviteStatusChangeSocket$ = this.socket.on('inviteStatusChange');

    this.newInviteSocket$.subscribe({
      next: userId => {
        const a = this.userService.getCurrentUserData();
        if (a?.id == userId) {
          this.loadInvitationFromFriends();
          this.loadEventRequests();
        }
      },
    });
    this.inviteStatusChangeSocket$.subscribe({
      next: userId => {
        const a = this.userService.getCurrentUserData();
        if (a?.id == userId) {
          this.loadInvitationFromFriends();
          this.loadEventRequests();
        }
      },
    });
  }

  getNewInviteSocket() {
    return this.newInviteSocket$;
  }

  getInviteStatusChangeSocket() {
    return this.inviteStatusChangeSocket$;
  }

  /**
   * Creates a join request for the given event ID.
   * @param eventId - The ID of the event to join.
   * @returns {Observable<{ success: boolean; message: string }>} An observable that emits the server response.
   */
  createJoinRequest(
    eventId: string,
  ): Observable<{ success: boolean; message: string }> {
    const url = `request/join/${eventId}`;
    return this.http.post<{ success: boolean; message: string }>(url, {}).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      }),
    );
  }

  /**
   * gets all Event Requests for the current logged in user
   * @returns {Observable<{ success: boolean; message: string }>}
   */
  getUsersRequests(): Observable<UsersEventRequest[]> {
    this.loadEventRequests();
    return this.eventRequestsSubject$.asObservable();
  }

  private userRequestSubject = new BehaviorSubject<UsersEventRequest | null>(
    null,
  );

  getUserRequestForEvent(
    eventId: string,
  ): Observable<UsersEventRequest | null> {
    const url = `request/join/user`;
    return this.http.get<UsersEventRequest[]>(url).pipe(
      map((requests: UsersEventRequest[]) => {
        const matchingRequest = requests.find(
          request => request.event.id === eventId,
        );
        this.userRequestSubject.next(matchingRequest || null); // Update the subject
        return matchingRequest || null;
      }),
      catchError(err => {
        this.userRequestSubject.next(null);
        return throwError(() => err);
      }),
    );
  }

  observeUserRequest(): Observable<UsersEventRequest | null> {
    return this.userRequestSubject.asObservable();
  }

  /**
   * gets all user requests for a given event
   * @param eventId
   * @returns {Observable<{ success: boolean; message: string }>}
   */
  /**
   * Gets all user requests for a given event
   * @param eventId The ID of the event
   * @returns {Observable<EventUserRequest[]>} An observable of event user requests
   */
  getEventHostRequests(eventId: string): Observable<EventUserRequest[]> {
    const url = `request/join/event/${eventId}`;
    return this.http.get<EventUserRequest[]>(url).pipe(
      catchError(err => {
        console.error('Error fetching event requests:', err);
        return throwError(() => err);
      }),
    );
  }

  getInvitationFromFriends(): Observable<UsersEventRequest[]> {
    this.loadInvitationFromFriends();
    return this.invitesSubject$.asObservable();
  }

  private loadInvitationFromFriends() {
    const url = `request/invite/user`;
    this.http
      .get<UsersEventRequest[]>(url)
      .pipe(
        catchError(() => {
          const arr: UsersEventRequest[] = [];
          return of(arr);
        }),
      )
      .subscribe(data => {
        this.invitesSubject$.next(data);
      });
  }

  private loadEventRequests() {
    const url = `request/join/user`;
    this.http
      .get<UsersEventRequest[]>(url)
      .pipe(
        catchError(() => {
          const arr: UsersEventRequest[] = [];
          return of(arr);
        }),
      )
      .subscribe(data => {
        this.eventRequestsSubject$.next(data);
      });
  }

  acceptUserRequest(
    requestId: number,
  ): Observable<{ success: boolean; message: string }> {
    const url = `request/accept/${requestId}`;
    return this.http
      .patch<{ success: boolean; message: string }>(url, {})
      .pipe();
  }

  acceptFriendsRequest(
    requestId: number,
  ): Observable<{ success: boolean; message: string }> {
    const url = `request/acceptInvite/${requestId}`;
    return this.http
      .patch<{ success: boolean; message: string }>(url, {})
      .pipe();
  }

  denyUserRequest(
    requestId: number,
  ): Observable<{ success: boolean; message: string }> {
    const url = `request/deny/${requestId}`;
    return this.http
      .patch<{ success: boolean; message: string }>(url, {})
      .pipe();
  }

  denyFriendsRequest(
    requestId: number,
  ): Observable<{ success: boolean; message: string }> {
    const url = `request/denyInvite/${requestId}`;
    return this.http.patch<{ success: boolean; message: string }>(url, {});
  }

  /**
   * Creates a join request for the given event ID.
   * @param requestId - The ID of the event to join.
   * @returns {Observable<{ success: boolean; message: string }>} An observable that emits the server response.
   */
  deleteUserRequest(
    requestId: number,
  ): Observable<{ success: boolean; message: string }> {
    const url = `request/delete/${requestId}`;
    return this.http
      .delete<{ success: boolean; message: string }>(url, {})
      .pipe();
  }

  createInvite(
    eventId: string,
    userId: string,
  ): Observable<{ success: boolean; message: string }> {
    const url = `request/invite/${eventId}/${userId}`;
    return this.http.post<{ success: boolean; message: string }>(url, {}).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
    );
  }

  getAllInvitesForEvent(eventId: string): Observable<EventUserRequest[]> {
    return this.http.get<EventUserRequest[]>(`request/invite/event/${eventId}`);
  }

  deleteEventInvite(inviteId: number) {
    return this.http.delete<{ success: boolean; message: string }>(
      `request/invite/${inviteId}`,
    );
  }
}
