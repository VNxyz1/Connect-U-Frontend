import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
   * @param eventId The ID of the event.
   * @returns An Observable containing read and unread messages.
   */
  getMessages(eventId: string): Observable<EventMessagesResponse> {
    return this.http.get<EventMessagesResponse>('message/' + eventId);
  }

  markMessagesAsRead(eventId: string): Observable<OkResponse> {
    return this.http.post<OkResponse>('message/' + eventId + '/read', {});
  }
}
