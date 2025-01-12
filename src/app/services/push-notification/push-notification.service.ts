import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {

  private navbarMyEventsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(5);
  private myEventsGuestSubject: BehaviorSubject<number> = new BehaviorSubject<number>(4);
  private myEventsHostSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  constructor() {
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

}
