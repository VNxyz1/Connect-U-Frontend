import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private readonly http: HttpClient) {}

  getAllEvents(): Observable<EventCardItem[]> {
    return this.http.get<EventCardItem[]>('event/allEvents');
  }
}
