import { EventDetails } from './EventDetails';

export interface UsersEventRequest {
  id: number;
  denied: boolean;
  event: EventDetails;
}
