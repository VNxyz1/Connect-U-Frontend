import { Category } from './Category';


export interface EventDetails {
  id: string;

  categories: Category[];

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
