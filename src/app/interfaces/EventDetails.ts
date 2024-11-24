import { Category } from './Category';
import { Gender } from './Gender';

export interface EventDetails {
  id: string;

  categories: Category[];

  preferredGenders: Gender[];

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
