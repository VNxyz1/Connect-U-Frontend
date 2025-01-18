import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SurveyCreateBody } from '../surveys/surveys.service';
import { ProfileData } from '../../interfaces/ProfileData';

type OkResponse = {
  ok: boolean;
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Sends a POST request to create a friendship using a username and an inviteId.
   *
   * @param {string} username - The username of the friend to connect with.
   * @param {string} inviteId - The ID of the invitation for the friendship.
   * @returns {Observable<OkResponse>} An observable with the server's response.
   */
  createFriendship(username: string, inviteId: string) {
    return this.http.put<OkResponse>(`friends/${username}/${inviteId}`, {});
  }

  getFriends(): Observable<ProfileData[]> {
    return this.http.get<ProfileData[]>('friends/allFriends');
  }

  getFilteredFriendsForEvent(eventId: String): Observable<ProfileData[]> {
    return this.http.get<ProfileData[]>(
      `friends/filteredFriends/${eventId}`,
      {},
    );
  }
}
