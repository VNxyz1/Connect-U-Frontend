import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, takeWhile } from 'rxjs';
import { ProfileData } from '../../interfaces/ProfileData';
import { map } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';

export type UpdateProfileBody = {
  pronouns: string;
  profileText: string;
  tags: string[];
};
export type UpdatePasswordBody = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};
export type UpdateAccountBody = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  city: string;
  streetNumber: string;
  street: string;
  zipCode: string;
};
type ok = {
  ok: boolean;
  message: string;
};
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly INVITE_LINK_KEY = 'invite_link';
  private readonly TTL_KEY = 'invite_ttl';

  private inviteLinkSubject = new BehaviorSubject<string | null>(null);
  private expirationTimeSubject = new BehaviorSubject<number | null>(null);

  inviteLink$ = this.inviteLinkSubject.asObservable();
  remainingTime$: Observable<number>;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {
    this.remainingTime$ = interval(1000).pipe(
      map(() => {
        const expirationTime = this.expirationTimeSubject.getValue();
        return expirationTime ? expirationTime - Date.now() : 0;
      }),
      takeWhile(time => time > 0, true),
    );
    this.loadStoredInviteLink();
  }

  /**
   * fetches the current User-Data
   * @returns {Observable<ProfileData>} an Observable that emits the Data of a User
   */
  getUserData(): Observable<ProfileData> {
    return this.http.get<ProfileData>('user/userData');
  }

  /**
   * fetches a specific User
   * @param userId (id from a specific User)
   * @returns {Observable<ProfileData>} an Observable that emits the data of a user
   */
  getSpecificUserData(userId: string): Observable<ProfileData> {
    return this.http.get<ProfileData>(`user/userProfile/${userId}`);
  }

  /**
   *
   * @param updateData
   */
  updateProfileInformation(
    updateData: Partial<UpdateProfileBody>,
  ): Observable<ok> {
    return this.http.patch<ok>('user/userProfile', updateData);
  }

  /**
   *
   * @param updateData
   */
  updateAccountInformation(
    updateData: UpdateAccountBody,
  ): Observable<ProfileData> {
    return this.http.patch<ProfileData>('user/userData', updateData);
  }

  /**
   *
   * @param updateData
   */
  updatePassword(updateData: UpdatePasswordBody): Observable<ok> {
    return this.http.patch<ok>('user/password', updateData);
  }

  updateProfilePicture(img: FormData): Observable<ok> {
    return this.http.patch<ok>('user/profilePicture', img);
  }
  getImageFile(image: string): string {
    const baseUrl: string = 'http://localhost:3000/api';
    const value = image == '' ? 'empty.png' : image;
    const path = `${baseUrl}/user/profilePicture/${value}`;
    console.log(path);
    return path;
  }

  getInviteLink() {
    return this.http.get<{ inviteLink: string; ttl: number }>(
      'user/inviteLink',
    );
  }

  async setInviteLink(link: string, ttl: number): Promise<void> {
    const expirationTime = Date.now() + ttl;

    await this.storageService.set(this.INVITE_LINK_KEY, link);
    await this.storageService.set(this.TTL_KEY, expirationTime);

    this.inviteLinkSubject.next(link);
    this.expirationTimeSubject.next(expirationTime);

    setTimeout(() => this.clearInviteLink(), ttl);
  }

  async loadStoredInviteLink(): Promise<void> {
    const link = await this.storageService.get<string>(this.INVITE_LINK_KEY);
    const expirationTime = await this.storageService.get<number>(this.TTL_KEY);

    if (link && expirationTime && expirationTime > Date.now()) {
      this.inviteLinkSubject.next(link);
      this.expirationTimeSubject.next(expirationTime);

      const remainingTime = expirationTime - Date.now();
      setTimeout(() => this.clearInviteLink(), remainingTime);
    } else {
      this.clearInviteLink();
    }
  }

  async clearInviteLink(): Promise<void> {
    await this.storageService.remove(this.INVITE_LINK_KEY);
    await this.storageService.remove(this.TTL_KEY);

    this.inviteLinkSubject.next(null);
    this.expirationTimeSubject.next(null);
  }


  /**
   * fetches a specific User
   * @param username (username from a specific User)
   * @returns {Observable<ProfileData>} an Observable that emits the data of a user
   */
  getSpecificUserDataByUsername(username: string): Observable<ProfileData> {
    return this.http.get<ProfileData>(`user/getUserByName/${username}`);
  }
}
