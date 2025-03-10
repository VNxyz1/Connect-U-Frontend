import { Category } from './Category';
import { Gender } from './Gender';
import { EventtypeEnum } from './EventtypeEnum';
import { StatusEnum } from './StatusEnum';
import { ProfileData } from './ProfileData';

export interface EventDetails {
  id: string;

  categories: Category[];

  tags: string[];

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

  status: StatusEnum;

  participantsNumber: number;

  maxParticipantsNumber: number;

  startAge?: number;

  endAge?: number;

  isHost?: boolean;

  isParticipant?: boolean;

  participants: ProfileData[];

  host: ProfileData;
}
