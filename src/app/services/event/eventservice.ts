import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

type EventData = {
  categories: number[];
  dateAndTime: string;
  title: string;
  description: string;
  type: number;
  isOnline: boolean;
  showAddress: boolean;
  streetNumber: string;
  street: string;
  zipCode: string;
  city: string;
  participantsNumber: number;
  preferredGenders: number[];
  startAge: number;
  endAge: number;
};

type Category = { id: number; name: string };

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private static instanceCounter = 0; // Static counter to track instances
  private instanceId: number;
  private _eventInformation: EventData = {
    categories: [],
    dateAndTime: '',
    title: '',
    description: '',
    type: 0,
    isOnline: false,
    showAddress: true,
    streetNumber: '',
    street: '',
    zipCode: '',
    city: '',
    participantsNumber: 0,
    preferredGenders: [],
    startAge: 0,
    endAge: 0,
  };

  constructor(private http: HttpClient) {
    this.instanceId = EventService.instanceCounter++;
    console.log(`EventService instance created with ID: ${this.instanceId}`);
  }


  private eventComplete = new Subject<EventData>();
  eventComplete$ = this.eventComplete.asObservable();


  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('category/all');
  }

  setEventInformation(data: Partial<EventData>): void {
    console.log("Setting event information...");
    console.log("Incoming data:", JSON.stringify(data, null, 2)); // Log incoming data

    // Perform the merge, ensuring all properties are updated correctly
    this._eventInformation = {
      ...this._eventInformation,
      ...data,
      categories: data.categories ?? this._eventInformation.categories,
      title: data.title ?? this._eventInformation.title,
      description: data.description ?? this._eventInformation.description
    };

    console.log("Updated _eventInformation:", JSON.stringify(this._eventInformation, null, 2));
  }

  getEventInformation(): EventData {
    console.log("getEventInfos:", JSON.stringify(this._eventInformation, null, 2));
    return this._eventInformation;
  }

  sendEventToServer(): Observable<EventData> {
    const url = '/event';
    return this.http.post<EventData>(url, this._eventInformation).pipe(
      map(response => {
        this.eventComplete.next(response);
        return response;
      })
    );
  }
}
