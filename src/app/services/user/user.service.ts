import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProfileData} from '../../interfaces/ProfileData';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly  http: HttpClient) { }

  /**
   * fetches the current User-Data
   * @returns {Observable<ProfileData>} an Observable that emits the Data of a User
   */
  getUserData():Observable<ProfileData> {
    return this.http.get<ProfileData>('user/userData')
  }
}
