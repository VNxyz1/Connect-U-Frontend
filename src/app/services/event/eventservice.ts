import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EventService {
  eventInformation: any = {
    step1: {
      title: '',
      image: '',
      category: '',
      type: '',
      description: ''
    },
    step2: {
      date: '',
      time: '',
      online: false,
      street: '',
      hnr: '',
      city: '',
      zipCode: '',
      hideAdress: false
    },
    step3: {
      participantNumber: '',
      participants: '',
      genders: '',
      ageFrom: '',
      ageTo: ''
    }
  };

  private eventComplete = new Subject<any>();

  eventComplete$ = this.eventComplete.asObservable();

  getEventInformation() {
    return this.eventInformation();
  }

  setEventInformation(eventInformation: Event): void {
    this.eventInformation = eventInformation;
  }

  complete() {
    this.eventComplete.next(this.eventInformation.step1);
  }
}
