import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../storage/storage.service';
import { EventDetails } from '../../../interfaces/EventDetails';
import { EventUserRequest } from '../../../interfaces/EventUserRequest';
import { UsersEventRequest} from '../../../interfaces/UsersEventRequest';

@Injectable({
  providedIn: 'root'
})
export class EventRequestService {

  constructor(
    private readonly http: HttpClient,
  ) { }

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
    const url = `request/join/user`;
    return this.http.get<UsersEventRequest[]>(url).pipe(
      map(res => {
        return res;
      }),
      catchError(err => {
        return throwError(() => err);
      })
    )
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
      })
    );
  }

  acceptUserRequest(requestId: number): Observable<{ success: boolean; message: string }> {
    const url = `request/accept/${requestId}`;
    return this.http.patch<{ success: boolean; message: string }>(url, {}).pipe()
  }

  denyUserRequest(requestId: number): Observable<{ success: boolean; message: string }> {
    const url = `request/deny/${requestId}`;
    return this.http.patch<{ success: boolean; message: string }>(url, {}).pipe()
  }

  /**
   * Creates a join request for the given event ID.
   * @param requestId - The ID of the event to join.
   * @returns {Observable<{ success: boolean; message: string }>} An observable that emits the server response.
   */
  deleteUserRequest(requestId: number): Observable<{ success: boolean; message: string }> {
    const url = `request/delete/${requestId}`;
    return this.http.delete<{ success: boolean; message: string }>(url, {}).pipe()
  }

}


