import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../storage/storage.service';

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
  getUsersRequests(): Observable<{ success: boolean; message: string }> {
    const url = `request/getRequestsByUser`;
    return this.http.get<{ success: boolean; message: string }>(url, {}).pipe(
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
  getEventRequests(eventId: string): Observable<{ success: boolean; message: string }> {
    const url = `request/getRequestsForEvent`;
    return this.http.get<{ success: boolean; message: string }>(url, {}).pipe(
      map(res => {
        return res;
      }),
      catchError(err => {
        return throwError(() => err);
      })
    )
  }


}


