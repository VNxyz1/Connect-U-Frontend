import { ProfileData } from './ProfileData';

export interface EventMessage {
  id: number,
  text: string,
  timestamp: string,
  writer: ProfileData;
  isHost: boolean;
}

export interface EventMessagesResponse {
  readMessages: EventMessage[];
  unreadMessages: EventMessage[];
}
