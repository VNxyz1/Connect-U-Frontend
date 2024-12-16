import { EventtypeEnum } from './EventtypeEnum';
import { Category } from './Category';
import { StatusEnum } from './StatusEnum';

export interface EventCardItem {
  id: string;

  tags: string[];

  categories: Category[];

  dateAndTime: string;

  title: string;

  picture: string;

  status: StatusEnum;

  type: EventtypeEnum;

  isOnline: boolean;

  city?: string;

  participantsNumber: number;

  maxParticipantsNumber: number;
}
