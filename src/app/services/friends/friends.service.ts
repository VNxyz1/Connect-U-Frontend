import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileData } from '../../interfaces/ProfileData';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private http: HttpClient) {}

  getFriends(){
    return this.http.get<ProfileData[]>('friends');
  }
}
