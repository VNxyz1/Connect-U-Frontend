import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  Observable,
  of,
  OperatorFunction,
  tap,
  withLatestFrom,
} from 'rxjs';
import { SocketService } from '../socket/socket.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { EventService } from '../event/eventservice';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { AppRoutes } from '../../interfaces/AppRoutes';
import { CurrentUrlService } from '../current-url/current-url.service';
import {EventRequestService} from '../event/event-request.service';
import {UsersEventRequest} from '../../interfaces/UsersEventRequest';
import {EventUserRequest} from '../../interfaces/EventUserRequest';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private hostedEventsListSubject: BehaviorSubject<Map<string, number>> =
    new BehaviorSubject<Map<string, number>>(new Map<string, number>());
  private guestEventsListSubject: BehaviorSubject<Map<string, number>> =
    new BehaviorSubject<Map<string, number>>(new Map<string, number>());

  private hostEventJoinRequestListSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private guestEventJoinRequestListSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  private currentUrl$!: Observable<string>;

  constructor(
    private socket: SocketService,
    private eventService: EventService,
    private http: HttpClient,
    private readonly currentUrl: CurrentUrlService,
    private readonly eventRequestService: EventRequestService,
  ) {
    this.currentUrl$ = this.currentUrl.get();
    this.initializePushNotifications();
    this.connectHostedEventsSocket();
  }

  /**
   * Combines notification counts from hosted and guest events for the navbar.
   * @returns {Observable<number>} Observable emitting the total notification count.
   */
  getNavbarMyEvents(): Observable<number> {
    return combineLatest([
      this.getMyEventsGuest(),
      this.getMyEventsHost(),
    ]).pipe(
      map(([host, guest]) => {
        return host + guest;
      }),
    );
  }

  /**
   * Retrieves the total number of notifications for guest events.
   * @returns {Observable<number>} Observable emitting the total number of guest event notifications.
   */
  getMyEventsGuest(): Observable<number> {
    return this.hostedEventsListSubject
      .asObservable()
      .pipe(this.mapToNotificationNumber());
  }

  /**
   * Retrieves the total number of notifications for hosted events.
   * @returns {Observable<number>} Observable emitting the total number of hosted event notifications.
   */
  getMyEventsHost(): Observable<number> {
    return this.guestEventsListSubject
      .asObservable()
      .pipe(this.mapToNotificationNumber());
  }

  /**
   * Retrieves the list of hosted events and their notification counts.
   * @returns {Observable<Map<string, number>>} Observable emitting a map of hosted event IDs and their notification counts.
   */
  getHostedEventsList(): Observable<Map<string, number>> {
    return this.hostedEventsListSubject.asObservable();
  }

  /**
   * Retrieves the list of guest events and their notification counts.
   * @returns {Observable<Map<string, number>>} Observable emitting a map of guest event IDs and their notification counts.
   */
  getGuestEventsList(): Observable<Map<string, number>> {
    return this.guestEventsListSubject.asObservable();
  }

  /**
   * Combines the notification counts from both hosted and guest event lists.
   * @returns {Observable<Map<string, number>>} Observable emitting a combined map of all event IDs and their notification counts.
   */
  getCompleteEventList(): Observable<Map<string, number>> {
    return combineLatest([
      this.getHostedEventsList(),
      this.getGuestEventsList(),
    ]).pipe(
      map(([hostedEvents, guestEvents]) => {
        return new Map<string, number>([
          ...Array.from(hostedEvents.entries()),
          ...Array.from(guestEvents.entries()),
        ]);
      }),
    );
  }

  /**
   * Clears the notification count for a specific event.
   * @param {string} eventId - The ID of the event to clear notifications for.
   */
  clearEvent(eventId: string) {
    const guest = this.guestEventsListSubject.getValue();
    const hosted = this.hostedEventsListSubject.getValue();
    if (guest.has(eventId)) {
      guest.set(eventId, 0);
      this.guestEventsListSubject.next(guest);
    } else if (hosted.has(eventId)) {
      hosted.set(eventId, 0);
      this.hostedEventsListSubject.next(hosted);
    }
  }

  /**
   * Establishes a socket connection to listen for new chat messages and updates notification counts.
   */
  private connectHostedEventsSocket() {
    this.socket
      .on('newChatMessages')
      .pipe(
        withLatestFrom(this.currentUrl$),
        map(([eventId, currentUrl]) => {
          const ignoreUrl = AppRoutes.EVENT.replace(':id', eventId);
          const includesEventId = currentUrl.includes(ignoreUrl);
          return includesEventId ? '' : eventId;
        }),
      )
      .subscribe({
        next: (eventId: string) => {
          const hosted = this.hostedEventsListSubject.getValue();
          const guest = this.guestEventsListSubject.getValue();
          if (hosted.has(eventId)) {
            const count = hosted.get(eventId) || 0;
            hosted.set(eventId, count + 1);
            this.hostedEventsListSubject.next(hosted);
          } else if (guest.has(eventId)) {
            const count = guest.get(eventId) || 0;
            guest.set(eventId, count + 1);
            this.guestEventsListSubject.next(guest);
          }
        },
      });
    this.socket.on('newInvite').subscribe({
      next: () => {

      }
    })
    this.socket.on('inviteStatusChange').subscribe({
      next: () => {

      }
    })
  }

  /**
   * Loads initial push notifications for both hosted and guest events.
   * @returns {Observable<void>} Observable that completes when notifications are loaded.
   */
  private loadPushNotifications(): Observable<void> {
    return combineLatest([
      this.http.get('push-notification/host').pipe(
        this.pipeMap(),
        this.catchErrorToEmptyMap(),
        tap(data => {
          const a = this.hostedEventsListSubject.getValue();
          for (const event of data) {
            a.set(event[0], event[1]);
          }
          this.hostedEventsListSubject.next(a);
        }),
      ),
      this.http.get('push-notification/participant').pipe(
        this.pipeMap(),
        this.catchErrorToEmptyMap(),
        tap(data => {
          const a = this.guestEventsListSubject.getValue();
          for (const event of data) {
            a.set(event[0], event[1]);
          }
          this.guestEventsListSubject.next(a);
        }),
      ),
    ]).pipe(map(() => void 0));
  }

  /**
   * Maps raw response data into a Map of event IDs and their notification counts.
   * @returns {OperatorFunction<any, Map<string, number>>} Operator function to transform response data.
   */
  private pipeMap(): OperatorFunction<any, Map<string, number>> {
    return map((data: any) => {
      const resultMap = new Map<string, number>();
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          resultMap.set(key, data[key]);
        }
      }
      return resultMap;
    });
  }

  /**
   * Catches errors and returns an empty map as a fallback.
   * @returns {OperatorFunction<any, Map<string, number>>} Operator function to handle errors.
   */
  private catchErrorToEmptyMap(): OperatorFunction<any, Map<string, number>> {
    return catchError(() => {
      return of(new Map<string, number>());
    });
  }

  /**
   * Maps a Map of event IDs to their total notification count.
   * @returns {OperatorFunction<Map<string, number>, number>} Operator function to calculate total notifications.
   */
  private mapToNotificationNumber() {
    return map((events: Map<string, number>) => {
      let count = 0;
      events.forEach(event => {
        count += event;
      });
      return count;
    });
  }

  /**
   * Initializes maps for hosted and guest events with their IDs and default notification counts.
   * @returns {Observable<void>} Observable that completes when maps are initialized.
   */
  private fillMaps(): Observable<void> {
    return combineLatest([
      this.eventService.getHostingEvents().pipe(
        this.fillMapsPipe(),
        this.catchErrorToEmptyMap(),
        tap(data => {
          this.hostedEventsListSubject.next(data);
        }),
      ),
      this.eventService.getParticipatingEvents().pipe(
        this.fillMapsPipe(),
        this.catchErrorToEmptyMap(),
        tap(data => {
          this.guestEventsListSubject.next(data);
        }),
      ),
    ]).pipe(map(() => void 0));
  }

  /**
   * Transforms a list of event card items into a Map with event IDs as keys and default notification counts as values.
   * @returns {OperatorFunction<EventCardItem[], Map<string, number>>} Operator function for transformation.
   */
  private fillMapsPipe(): OperatorFunction<
    EventCardItem[],
    Map<string, number>
  > {
    return map((data: EventCardItem[]) => {
      const resultMap = new Map<string, number>();
      for (const event of data) {
        resultMap.set(event.id, 0);
      }
      return resultMap;
    });
  }

  /**
   * Initializes the push notification service by filling maps and loading notifications.
   */
  private initializePushNotifications() {
    this.fillMaps()
      .pipe(concatMap(() => this.loadPushNotifications()))
      .subscribe({
        next: () => {},
        error: err => {
          console.error('Error initializing push notifications:', err);
        },
      });
  }

  private loadEventRequestNotifications() {
    this.eventRequestService.getUsersRequests()
      .pipe(
        map((eventRequests: UsersEventRequest[]) => {
          let count = 0;
           eventRequests.forEach((req: UsersEventRequest) => {
             if (req.denied) {
               count++
             }
          })
          return count;
        }),
        catchError(()=> of(0))
      )
      .subscribe({
      next: (count: number) => {
        this.guestEventJoinRequestListSubject.next(count)
      },
    })

    //Todo: backendroute die alle requests pro eventid zurück gibt...
    this.eventRequestService.getEventHostRequests()
      .pipe(
        map((eventRequests: EventUserRequest[]) => {
          let count = 0;
          eventRequests.forEach((req: EventUserRequest) => {
            if (req.denied) {
              count++
            }
          })
          return count;
        }),
        catchError(()=> of(0))
      )
      .subscribe({
        next: (count: number) => {
          this.guestEventJoinRequestListSubject.next(count)
        },
      })
  }
}
