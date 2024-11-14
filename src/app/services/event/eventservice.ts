import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
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
type Gender = { id: number; gender: number };

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly STORAGE_KEY = 'eventInformation'; // Key for stored data
  private _eventInformation: EventData | null = null;

  private readonly eventComplete = new Subject<EventData>();
  eventComplete$ = this.eventComplete.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly storageService: StorageService // Injected storage service
  ) {}

  async getEventInformation(): Promise<EventData> {
    if (!this._eventInformation) {
      const savedData = await this.storageService.get<EventData>(this.STORAGE_KEY);
      this._eventInformation = savedData || this.getDefaultEventData();
    }
    console.log('getEventInformation:', this._eventInformation);
    return this._eventInformation;
  }

  async setEventInformation(data: Partial<EventData>): Promise<void> {
    console.log('Setting event information...');
    console.log('Incoming data:', JSON.stringify(data, null, 2));

    this._eventInformation = {
      ...(this._eventInformation || this.getDefaultEventData()),
      ...data,
    };

    await this.storageService.set(this.STORAGE_KEY, this._eventInformation);
    console.log('Updated _eventInformation:', JSON.stringify(this._eventInformation, null, 2));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('category/all');
  }

  getGenders(): Observable<Gender[]> {
    return this.http.get<Gender[]>('gender/all');
  }

  sendEventToServer(): Observable<EventData> {
    const url = 'event';

    // Transform _eventInformation to include only the category and gender IDs
    const payload: EventData = {
      ...(this._eventInformation || this.getDefaultEventData()),
      categories: this._eventInformation?.categories.map((category: any) =>
        typeof category === 'object' && 'id' in category ? category.id : category
      ) || [],
      preferredGenders: this._eventInformation?.preferredGenders.map((gender: any) =>
        typeof gender === 'object' && 'id' in gender ? gender.id : gender
      ) || [],
    };

    console.log('Sending transformed data:', JSON.stringify(payload, null, 2));

    return this.http.post<EventData>(url, payload).pipe(
      map((response) => {
        this.eventComplete.next(response);
        return response;
      })
    );
  }

  private getDefaultEventData(): EventData {
    return {
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
      startAge: 16,
      endAge: 99,
    };
  }
}
