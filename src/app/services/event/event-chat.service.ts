import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { List } from '../lists/list.service';
import { EventMessagesResponse } from '../../interfaces/Messages';

type OkResponse = {
  ok: boolean;
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class EventChatService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetch messages for a specific event.
   * Retrieves both read and unread messages for a given event.
   * @param eventId The unique identifier of the event.
   * @returns An Observable containing an object with arrays of read and unread messages.
   */
  getMessages(eventId: string): Observable<EventMessagesResponse> {
    return this.http.get<EventMessagesResponse>('message/' + eventId);
  }

  /**
   * Mark all unread messages as read for a specific event.
   * Updates the backend to mark messages as read for the logged-in user.
   * @param eventId The unique identifier of the event.
   * @returns An Observable with a response indicating success or failure.
   */
  markMessagesAsRead(eventId: string): Observable<OkResponse> {
    return this.http.post<OkResponse>('message/' + eventId + '/read', {});
  }

  /**
   * Post a new chat message for a specific event.
   * Sends a new message to the backend and associates it with the given event.
   * @param eventId The unique identifier of the event.
   * @param content The message content to be sent.
   * @returns An Observable with a response indicating success or failure.
   */
  postChatMessage(eventId: string, content: string): Observable<OkResponse> {
    return this.http.post<OkResponse>('message/' + eventId + '/message', {
      content,
    });
  }
}
