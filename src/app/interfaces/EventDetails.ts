import { Category } from './Category';
import { Gender } from './Gender';
import { EventtypeEnum } from './EventtypeEnum';

export interface EventDetails {
  id: string;

  categories: Category[];

  preferredGenders: Gender[];

  type: EventtypeEnum;

  dateAndTime: string;

  title: string;

  description?: string;

  picture: string;

  isOnline: boolean;

  streetNumber?: string;

  street?: string;

  zipCode?: string;

  city?: string;

  participantsNumber: number;

  maxParticipantsNumber: number;

  startAge?: number;

  endAge?: number;
}
