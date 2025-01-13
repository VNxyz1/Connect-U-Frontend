import { Injectable } from '@angular/core';
import { SearchParams } from '../../interfaces/SearchParams';
import { Observable, throwError } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventSearchService {
  constructor(private readonly http: HttpClient) {}

  getFilteredEvents(filters: SearchParams): Observable<EventCardItem[]> {
    const updatedFilters: SearchParams = {
      ...filters,
    };

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(val => params.append(key, String(val)));
      } else if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    return this.http
      .get<EventCardItem[]>(`event/filteredEvents`, {
        params: {
          ...updatedFilters,
          page: 0,
          size: 12,
        },
      })
      .pipe(
        catchError(error => {
          console.error('Error fetching filtered events:', error);
          return throwError(() => error);
        }),
      );
  }
}
