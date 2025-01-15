import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  of,
  OperatorFunction,
  tap,
} from 'rxjs';
import { SocketService } from '../socket/socket.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { EventService } from '../event/eventservice';
import { EventCardItem } from '../../interfaces/EventCardItem';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private hostedEventsListSubject: BehaviorSubject<Map<string, number>> =
    new BehaviorSubject<Map<string, number>>(new Map<string, number>());
  private guestEventsListSubject: BehaviorSubject<Map<string, number>> =
    new BehaviorSubject<Map<string, number>>(new Map<string, number>());

  constructor(
    private socket: SocketService,
    private eventService: EventService,
    private http: HttpClient,
  ) {
    this.initializePushNotifications();
    this.connectHostedEventsSocket();
  }

  getNavbarMyEvents() {
    return combineLatest([
      this.getMyEventsGuest(),
      this.getMyEventsHost(),
    ]).pipe(
      map(([host, guest]) => {
        return host + guest;
      }),
    );
  }

  getMyEventsGuest() {
    return this.hostedEventsListSubject
      .asObservable()
      .pipe(this.mapToNotificationNumber());
  }

  getMyEventsHost() {
    return this.guestEventsListSubject
      .asObservable()
      .pipe(this.mapToNotificationNumber());
  }

  getHostedEventsList() {
    return this.hostedEventsListSubject.asObservable();
  }

  getGuestEventsList() {
    return this.guestEventsListSubject.asObservable();
  }

  getCompleteEventList() {
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

  private connectHostedEventsSocket() {
    this.socket.on('newChatMessages').subscribe({
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
  }

  private loadPushNotifications() {
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

  private catchErrorToEmptyMap(): OperatorFunction<any, Map<string, number>> {
    return catchError(() => {
      return of(new Map<string, number>());
    });
  }

  private mapToNotificationNumber() {
    return map((events: Map<string, number>) => {
      let count = 0;
      events.forEach(event => {
        count += event;
      });
      return count;
    });
  }

  private fillMaps() {
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

  private fillMapsPipe() {
    return map((data: EventCardItem[]) => {
      const resultMap = new Map<string, number>();
      for (const event of data) {
        resultMap.set(event.id, 0);
      }
      return resultMap;
    });
  }

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
}
