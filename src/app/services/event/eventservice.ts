import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EventCardItem } from '../../interfaces/EventCardItem';

export type EventData = {
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
  startAge: number | null;
  endAge: number | null;
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
    private readonly storageService: StorageService, // Injected storage service
  ) {}

  /**
   * Retrieves the current event information from storage or initializes it with default values.
   * @returns {Promise<EventData>} A promise that resolves to the current event data.
   */
  async getEventInformation(): Promise<EventData> {
    if (!this._eventInformation) {
      const savedData = await this.storageService.get<EventData>(
        this.STORAGE_KEY,
      );
      this._eventInformation = savedData || this.getDefaultEventData();
    }
    return this._eventInformation;
  }

  /**
   * Updates the current event information and saves it to storage.
   * @param {Partial<EventData>} data - Partial event data to merge with the current event data.
   * @returns {Promise<void>} A promise that resolves when the data is saved.
   */
  async setEventInformation(data: Partial<EventData>): Promise<void> {
    this._eventInformation = {
      ...(this._eventInformation || this.getDefaultEventData()),
      ...data,
    };

    await this.storageService.set(this.STORAGE_KEY, this._eventInformation);
  }

  /**
   * Fetches all available categories from the server.
   * @returns {Observable<Category[]>} An observable that emits an array of categories.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('category/all');
  }

  /**
   * Fetches all available genders from the server.
   * @returns {Observable<Gender[]>} An observable that emits an array of genders.
   */
  getGenders(): Observable<Gender[]> {
    return this.http.get<Gender[]>('gender/all');
  }

  /**
   * Validates and posts the current event information to the server.
   * If successful, resets the event data and clears storage.
   * @returns {Observable<EventData>} An observable that emits the posted event data.
   */
  postEvent(): Observable<EventData> {
    const url = 'event';

    // Validate required fields before posting
    if (
      !this._eventInformation?.title?.trim() || // Title should not be empty or whitespace
      this._eventInformation.categories.length === 0 || // At least one category
      !this._eventInformation.dateAndTime || // Date must be filled
      isNaN(Date.parse(this._eventInformation.dateAndTime)) || // Date must be valid ISO format
      (!this._eventInformation.isOnline && // If not online, address must be valid
        (!this._eventInformation.street.trim() ||
          !this._eventInformation.streetNumber.trim() ||
          !this._eventInformation.zipCode.trim() ||
          !this._eventInformation.city.trim())) ||
      this._eventInformation.participantsNumber < 2 // Participants number >= 2
    ) {
      console.error(
        'Validation failed. Required fields are missing or invalid.',
      );
      return throwError(
        () => new Error('Validation failed. Check your inputs.'),
      );
    }
    if (this._eventInformation.startAge == 16) {
      this._eventInformation.startAge = null;
    }
    if (this._eventInformation.endAge == 99) {
      this._eventInformation.endAge = null;
    }

    // Ensure the date is in ISO format
    const isoDateAndTime = new Date(
      this._eventInformation.dateAndTime,
    ).toISOString();

    // Transform _eventInformation to include only the category and gender IDs
    const payload: EventData = {
      ...(this._eventInformation || this.getDefaultEventData()),
      dateAndTime: isoDateAndTime, // Use ISO-formatted date
      categories:
        this._eventInformation?.categories.map((category: any) =>
          typeof category === 'object' && 'id' in category
            ? category.id
            : category,
        ) || [],
      ...(this._eventInformation?.preferredGenders?.length
        ? {
            preferredGenders: this._eventInformation.preferredGenders.map(
              (gender: any) =>
                typeof gender === 'object' && 'id' in gender
                  ? gender.id
                  : gender,
            ),
          }
        : {}),
    };

    return this.http.post<EventData>(url, payload).pipe(
      map(response => {
        // Emit the response upon success
        this.eventComplete.next(response);

        // Reset _eventInformation and delete the storage key upon successful creation
        this._eventInformation = this.getDefaultEventData();
        this.storageService.remove(this.STORAGE_KEY);

        return response;
      }),
      catchError(error => {
        console.error('Error posting event:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Fetches all events from the server.
   * @returns {Observable<EventCardItem[]>} An observable that emits an array of event card items.
   */
  getAllEvents(): Observable<EventCardItem[]> {
    return this.http.get<EventCardItem[]>('event/allEvents');
  }

  /**
   * Fetches the participating Events of an User
   * @returns {Observable<EventCardItem[]>} An observable that emits an User specific array of event card items.
   */
  getParticipatingEvents(): Observable<EventCardItem[]> {
    return this.http.get<EventCardItem[]>('event/participatingEvents', {withCredentials: true});
  }

  getHostingEvents(): Observable<EventCardItem[]> {
    return this.http.get<EventCardItem[]>('event/hostingEvents', {withCredentials: true});
  }
  /*
  //not implemented yet
  getFavoriteEvents(): Observable<EventCardItem[]>{
    return this.http.get<EventCardItem[]>('event/favorites', {withCredentials: true});
  }
   */


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
