import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SwPush} from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {

  private navbarMyEventsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(5);
  private myEventsGuestSubject: BehaviorSubject<number> = new BehaviorSubject<number>(4);
  private myEventsHostSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  private pushSubscription!: PushSubscription;

  constructor(private swPush: SwPush) {
    swPush.subscription.subscribe({
      next: subscription => {
        const isSubscribed = !(subscription === null);

        if (isSubscribed) {
          console.log('User IS subscribed.');
        } else {
          console.log('User is NOT subscribed.');
        }
      }
    })
  }

  private async initSubscription(swPush: SwPush) {
    this.pushSubscription = await swPush.requestSubscription({serverPublicKey: "BK0O31ty9muHFIAaGNOjCwzv85uIlU3xai9hM3YA_0LRkaGhlk0LEfpOHV7xnhTLTZXrXUj2ZiVywjWkfkBu89w"});
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
