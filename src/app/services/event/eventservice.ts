import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { EventDetails } from '../../interfaces/EventDetails';

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
  private readonly storageKeyCreate = 'eventCreateInformation'; // Key for stored data
  private _eventCreateInformation: EventData | null = null;


  private readonly eventComplete = new Subject<EventData>();
  eventComplete$ = this.eventComplete.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Retrieves the current event information from storage or initializes it with default values.
   * @returns {Promise<EventData>} A promise that resolves to the current event data.
   */
  async getEventCreateInformation(): Promise<EventData> {
    if (!this._eventCreateInformation) {
      const savedData = await this.storageService.get<EventData>(
        this.storageKeyCreate,
      );
      this._eventCreateInformation = savedData || this.getDefaultEventData();
    }
    return this._eventCreateInformation;
  }

  /**
   * Updates the current event information and saves it to storage.
   * @param {Partial<EventData>} data - Partial event data to merge with the current event data.
   * @returns {Promise<void>} A promise that resolves when the data is saved.
   */
  async setEventInformation(data: Partial<EventData>): Promise<void> {
    this._eventCreateInformation = {
      ...(this._eventCreateInformation || this.getDefaultEventData()),
      ...data,
    };

    await this.storageService.set(this.storageKeyCreate, this._eventCreateInformation);
  }

  async removeEventInformation(): Promise<void> {
    return await this.storageService.remove(this.storageKeyCreate);
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
      !this._eventCreateInformation?.title?.trim() || // Title should not be empty or whitespace
      this._eventCreateInformation.categories.length === 0 || // At least one category
      !this._eventCreateInformation.dateAndTime || // Date must be filled
      isNaN(Date.parse(this._eventCreateInformation.dateAndTime)) || // Date must be valid ISO format
      (!this._eventCreateInformation.isOnline && // If not online, address must be valid
        (!this._eventCreateInformation.street.trim() ||
          !this._eventCreateInformation.streetNumber.trim() ||
          !this._eventCreateInformation.zipCode.trim() ||
          !this._eventCreateInformation.city.trim())) ||
      this._eventCreateInformation.participantsNumber < 2 // Participants number >= 2
    ) {
      console.error(
        'Validation failed. Required fields are missing or invalid.',
      );
      return throwError(
        () => new Error('Validation failed. Check your inputs.'),
      );
    }
    if (this._eventCreateInformation.startAge == 16) {
      this._eventCreateInformation.startAge = null;
    }
    if (this._eventCreateInformation.endAge == 99) {
      this._eventCreateInformation.endAge = null;
    }

    // Ensure the date is in ISO format
    const isoDateAndTime = new Date(
      this._eventCreateInformation.dateAndTime,
    ).toISOString();

    // Transform _eventInformation to include only the category and gender IDs
    const payload: EventData = {
      ...(this._eventCreateInformation || this.getDefaultEventData()),
      dateAndTime: isoDateAndTime, // Use ISO-formatted date
      categories:
        this._eventCreateInformation?.categories.map((category: any) =>
          typeof category === 'object' && 'id' in category
            ? category.id
            : category,
        ) || [],
      ...(this._eventCreateInformation?.preferredGenders?.length
        ? {
            preferredGenders: this._eventCreateInformation.preferredGenders.map(
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
        this._eventCreateInformation = this.getDefaultEventData();
        this.removeEventInformation();

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
    return this.http.get<EventCardItem[]>('event/participatingEvents');
  }

  getHostingEvents(): Observable<EventCardItem[]> {
    return this.http.get<EventCardItem[]>('event/hostingEvents');
  }
  /*
  //not implemented yet
  getFavoriteEvents(): Observable<EventCardItem[]>{
    return this.http.get<EventCardItem[]>('event/favorites');
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

  /**
   * Fetches event details from the server.
   * @returns {Observable<EventDetails>} An observable that emits the event details.
   */
  getEventDetails(id: string): Observable<EventDetails> {
    return this.http.get<EventDetails>(`event/eventDetails/${id}`);
  }

  /**
   * Adds the current user to the event's participants list.
   * @param eventId - The ID of the event to join.
   * @returns {Observable<{ success: boolean; message: string }>} An observable that emits the server response.
   */
  addUserToEvent(
    eventId: string,
  ): Observable<{ success: boolean; message: string }> {
    const url = `event/join/${eventId}`;
    return this.http.post<{ success: boolean; message: string }>(url, {}).pipe(
      map(response => {
        console.log(
          'User successfully added to the event participants:',
          response,
        );
        return response;
      }),
      catchError(error => {
        console.error(
          'Error adding user to the event participants list:',
          error,
        );
        return throwError(() => error);
      }),
    );
  }
}
