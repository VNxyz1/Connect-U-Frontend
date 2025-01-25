import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileData } from '../../interfaces/ProfileData';
import { SocketService } from '../socket/socket.service';
import { UserService } from '../user/user.service';

type OkResponse = {
  ok: boolean;
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private readonly friendsSubject$ = new BehaviorSubject<ProfileData[]>([]);

  constructor(
    private readonly http: HttpClient,
    private readonly sockets: SocketService,
    private readonly userService: UserService,
  ) {
    this.connectSockets();
  }

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
    this.reloadFriends();
    return this.friendsSubject$.asObservable();
  }

  private reloadFriends() {
    this.http.get<ProfileData[]>('friends/allFriends').subscribe({
      next: result => this.friendsSubject$.next(result),
      error: () => this.friendsSubject$.next([]),
    });
  }

  getFilteredFriendsForEvent(eventId: String): Observable<ProfileData[]> {
    return this.http.get<ProfileData[]>(
      `friends/filteredFriends/${eventId}`,
      {},
    );
  }

  private connectSockets() {
    this.sockets.on('updateFriendList').subscribe({
      next: (userId: string) => {
        const a = this.userService.getCurrentUserData();
        if (a?.id == userId) {
          this.reloadFriends();
        }
      },
    });
  }
}
