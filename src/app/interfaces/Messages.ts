import { ProfileData } from './ProfileData';

export interface Message {
  id: number,
  text: string,
  timestamp: string,
  writer: ProfileData;
  isHost: boolean;
}

export interface EventMessagesResponse {
  readMessages: Message[];
  unreadMessages: Message[];
}
