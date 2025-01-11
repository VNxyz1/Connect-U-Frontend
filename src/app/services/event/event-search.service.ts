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


  constructor(private readonly http: HttpClient) {
  }

  getFilteredEvents(filters: SearchParams): Observable<EventCardItem[]> {
    const defaultGenders = [1, 2, 3];
    const updatedFilters: SearchParams = {
      ...filters,
      genders: Array.isArray(filters.genders)
        ? Array.from(new Set([...filters.genders, ...defaultGenders]))
        : defaultGenders,
    };

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => params.append(key, String(val)));
      } else if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    return this.http
      .get<EventCardItem[]>(`event/filteredEvents?${params.toString()}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching filtered events:', error);
          return throwError(() => error);
        }),
      );
  }
}
