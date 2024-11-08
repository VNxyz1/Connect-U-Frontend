import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

type LoginBody = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  expiration_time: number;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _accessToken: string | undefined;

  constructor(private http: HttpClient) {}

  /**
   * to be implemented
   */
  isLoggedIn(): boolean {
    return true;
  }

  //TODO: return type must be specified when the backend route is created
  logIn(body: LoginBody): Observable<Object> {
    return this.http.post<LoginResponse>('auth/login', body).pipe(
      map(response => {
        this._accessToken = response.access_token;
        return response;
      }),
    );
  }

  getAccessToken(): string | undefined {
    return this._accessToken;
  }

  setAccessToken(token: string): void {
    this._accessToken = token;
  }

  refreshToken(): Observable<{ access_token: string }> {
    return this.http.get<{ access_token: string }>('auth/refresh').pipe(
      map(response => {
        this._accessToken = response.access_token;
        return response;
      }),
    );
  }

  temp() {
    return this.http.get<{ waaahhh: string }>('auth/profile');
  }
}
