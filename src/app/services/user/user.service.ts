import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, takeWhile, tap } from 'rxjs';
import { ProfileData } from '../../interfaces/ProfileData';
import { map } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';
import { CurrentUrlService } from '../current-url/current-url.service';
import { AppRoutes } from '../../interfaces/AppRoutes';

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

  private inviteLinkTimer: any;

  private userdataSubject = new BehaviorSubject<ProfileData | undefined>(
    undefined,
  );

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private currentUrl: CurrentUrlService,
  ) {
    this.remainingTime$ = interval(1000).pipe(
      map(() => {
        const expirationTime = this.expirationTimeSubject.getValue();
        return expirationTime ? expirationTime - Date.now() : 0;
      }),
      takeWhile(time => time > 0, true),
    );
    this.loadStoredInviteLink();
    this.getUserData().subscribe({});
  }

  getCurrentUserData() {
    if (this.userdataSubject.getValue()) {
      return this.userdataSubject.getValue();
    }
    this.getUserData().subscribe({});
    return this.userdataSubject.getValue();
  }

  /**
   * fetches the current User-Data
   * @returns {Observable<ProfileData>} an Observable that emits the Data of a User
   */
  getUserData(): Observable<ProfileData> {
    return this.http.get<ProfileData>('user/userData').pipe(
      tap(data => {
        this.userdataSubject.next(data);
      }),
    );
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
    const value = image == '' ? 'empty.png' : image;
    if (image == 'empty.png') {
      return `/images/userImg.png`;
    }
    return `${environment.apiConfig.urlPrefix}user/profilePicture/${value}`;
  }

  private getNewInviteLink() {
    return this.http.get<{ inviteLink: string; ttl: number }>(
      'user/inviteLink',
    );
  }

  private async setInviteLink(link: string, ttl: number): Promise<void> {
    clearTimeout(this.inviteLinkTimer);

    const expirationTime = Date.now() + ttl;

    await this.storageService.set(this.INVITE_LINK_KEY, link);
    await this.storageService.set(this.TTL_KEY, expirationTime);

    this.inviteLinkSubject.next(link);
    this.expirationTimeSubject.next(expirationTime);
  }

  private setLinkTimer(ttl: number) {
    clearTimeout(this.inviteLinkTimer);
    this.inviteLinkTimer = setTimeout(() => {
      this.clearInviteLink();
      const a = this.currentUrl.get().subscribe({
        next: url => {
          if (url.includes(AppRoutes.SHARE_PROFILE)) {
            this.startInviteLinkGeneration();
          }
          a.unsubscribe();
        },
      });
    }, ttl);
  }

  startInviteLinkGeneration(): void {
    this.getNewInviteLink().subscribe({
      next: async inviteLink => {
        await this.setInviteLink(inviteLink.inviteLink, inviteLink.ttl);
        this.setLinkTimer(inviteLink.ttl);
      },
    });
  }

  async loadStoredInviteLink(): Promise<void> {
    clearTimeout(this.inviteLinkTimer);
    const link = await this.storageService.get<string>(this.INVITE_LINK_KEY);
    const expirationTime = await this.storageService.get<number>(this.TTL_KEY);

    if (link && expirationTime && expirationTime > Date.now()) {
      this.inviteLinkSubject.next(link);
      this.expirationTimeSubject.next(expirationTime);

      const remainingTime = expirationTime - Date.now();
      this.setLinkTimer(remainingTime);
    } else {
      clearTimeout(this.inviteLinkTimer);
      this.clearInviteLink();
    }
  }

  async hasActiveLink() {
    const link = await this.storageService.get<string>(this.INVITE_LINK_KEY);
    const expirationTime = await this.storageService.get<number>(this.TTL_KEY);
    const relevant = (expirationTime || 0) > Date.now();
    return link != null && expirationTime != null && relevant;
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
    return this.http.get<ProfileData>(`user/friendProfile/${username}`);
  }

  deleteProfilePicture() {
    return this.http.delete<ok>('user/profilePicture');
  }
}
