import { ProfileData } from './ProfileData';

export interface EventUserRequest {
  id: number;
  denied: boolean;
  user: ProfileData;
}
