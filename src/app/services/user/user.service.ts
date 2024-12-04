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
  getSpecificUserData(userId:string): Observable<ProfileData> {
    return this.http.get<ProfileData>(`user/userProfile/${userId}`);
  }

  updateProfileInformation(updateData:UpdateProfileBody): Observable<any> {
    return this.http.patch<any>('user/userProfile', updateData);
  }
  updateAccountInformation(updateData:any): Observable<any> {
    return this.http.patch<any>('user/userData', updateData);
  }
  updatePassword(updateData:UpdatePasswordBody): Observable<ok> {
    return this.http.patch<ok>('user/password',updateData );
  }
}
