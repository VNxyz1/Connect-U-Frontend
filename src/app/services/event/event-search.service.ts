import { Injectable } from '@angular/core';
import { SearchParams } from '../../interfaces/SearchParams';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventSearchService {
  private params: SearchParams = {
    genders: [1, 2, 3],
  };

  private page = 0;
  private readonly pageSize = 12;

  private totalEventCountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private eventsSubject: BehaviorSubject<EventCardItem[]> = new BehaviorSubject<
    EventCardItem[]
  >([]);
  private hasMoreEventsSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  constructor(private readonly http: HttpClient) {}

  /**
   * Initializes search parameters to be used for filtering events.
   * @param {SearchParams} params - The search parameters to initialize.
   */
  initSearchParams(params: SearchParams) {
    this.params = params;
    this.loadNextPage();
  }

  /**
   * Retrieves the total count of events based on the current search parameters.
   * @returns {Observable<number>} Observable emitting the total event count.
   */
  getTotalEventsCount(): Observable<number> {
    return this.totalEventCountSubject.asObservable();
  }

  /**
   * Loads the next page of filtered events and updates the events list.
   * If no more events are available, it stops further loading.
   */
  loadNextPage(): void {
    if (!this.hasMoreEventsSubject.getValue()) {
      this.eventsSubject.next(this.eventsSubject.getValue());
      return;
    }

    this.loadPage(this.page, this.pageSize).subscribe({
      next: newItems => {
        if (newItems.length === 0) {
          this.hasMoreEventsSubject.next(false);
          return;
        }

        const currentItems = this.eventsSubject.getValue();
        const updatedItems = [...currentItems, ...newItems];
        this.eventsSubject.next(updatedItems);
      },
    });
    this.page++;
  }

  /**
   * Combines the list of filtered events with a flag indicating if more events are available.
   * @returns {Observable<{ events: EventCardItem[]; hasMore: boolean }>} Observable emitting the events and their availability status.
   */
  getFilteredEvents(): Observable<{
    events: EventCardItem[];
    hasMore: boolean;
  }> {
    return combineLatest([
      this.eventsSubject.asObservable(),
      this.hasMoreEventsSubject.asObservable(),
    ]).pipe(
      map(([events, hasMore]) => ({
        events,
        hasMore,
      })),
    );
  }

  /**
   * Loads a specific page of events based on the search parameters.
   * @param {number} page - The page number to load.
   * @param {number} pageSize - The number of events per page.
   * @returns {Observable<EventCardItem[]>} Observable emitting the list of events on the page.
   */
  private loadPage(
    page: number,
    pageSize: number,
  ): Observable<EventCardItem[]> {
    return this.http
      .get<{ events: EventCardItem[]; total: number }>('event/filteredEvents', {
        params: {
          ...this.params,
          page: page,
          size: pageSize,
        },
      })
      .pipe(
        map(res => {
          this.totalEventCountSubject.next(res.total);
          return res.events;
        }),
        catchError(error => {
          if (error.status === 404) {
            const arr: EventCardItem[] = [];
            return of(arr);
          } else {
            console.error('Error fetching filtered events:', error);
            return throwError(() => error);
          }
        }),
      );
  }
}
