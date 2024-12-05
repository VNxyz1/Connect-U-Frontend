import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileData } from '../../interfaces/ProfileData';

export type UpdateProfileBody = {
  pronouns:string,
  profileText:string,
}
export type UpdatePasswordBody = {
  oldPassword:string
  newPassword:string
  newPasswordConfirm:string
}
export type UpdateAccountBody = {
  "firstName":string,
  "lastName":string,
  "username":string,
  "email":string,
  "city":string,
  "streetNumber":string,
  "street":string,
  "zipCode":string,
}
type ok = {
  ok:boolean;
  message:string
}
@Injectable({
  providedIn: 'root',
})

export class UserService {
  constructor(private http: HttpClient) {}

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
  getSpecificUserData(userId:string): Observable<ProfileData> {
    return this.http.get<ProfileData>(`user/userProfile/${userId}`);
  }

  /**
   *
   * @param updateData
   */
  updateProfileInformation(updateData:Partial<UpdateProfileBody>): Observable<ok> {
    return this.http.patch<ok>('user/userProfile', updateData);
  }

  /**
   *
   * @param updateData
   */
  updateAccountInformation(updateData:any): Observable<any> {
    return this.http.patch<any>('user/userData', updateData);
  }

  /**
   *
   * @param updateData
   */
  updatePassword(updateData:UpdatePasswordBody): Observable<ok> {
    return this.http.patch<ok>('user/password',updateData );
  }
}
