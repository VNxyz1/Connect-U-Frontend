import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { SocketService } from '../socket/socket.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private navbarMyEventsSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private myEventsGuestSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private myEventsHostSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private hostedEventsListSubject: BehaviorSubject<Map<string, number>> =
    new BehaviorSubject<Map<string, number>>(new Map<string, number>());

  constructor(
    private socketService: SocketService,
    private http: HttpClient,
  ) {
    this.loadPushNotifications();
  }

  getNavbarMyEvents() {
    return this.navbarMyEventsSubject.asObservable();
  }

  getMyEventsGuest() {
    return this.myEventsGuestSubject.asObservable();
  }

  getMyEventsHost() {
    return this.myEventsHostSubject.asObservable();
  }

  getHostedEventsList() {
    return this.hostedEventsListSubject.asObservable();
  }

  private connectHostedEventsSocket() {
    return this.socketService.on('pushNotificationEvent').pipe(
      map((events: { eventId: string; notificationCount: number }[]) => {
        const currentMap: Map<string, number> =
          this.hostedEventsListSubject.getValue();
        events.forEach(e => {
          const existingCount = currentMap.get(e.eventId) || 0;
          currentMap.set(e.eventId, existingCount + e.notificationCount);
        });
        return currentMap;
      }),
    );
  }

  private loadPushNotifications() {
    this.http
      .get('push-notification')
      .pipe(
        map((data: any) => {
          const a = new Map<string, number>();
          for (const e in data) {
            a.set(e, data[e]);
          }
          return a;
        }),
        catchError(() => {
          return of(new Map<string, number>());
        }),
      )
      .subscribe({
        next: data => {
          this.hostedEventsListSubject.next(data);
        },
      });
  }
}
