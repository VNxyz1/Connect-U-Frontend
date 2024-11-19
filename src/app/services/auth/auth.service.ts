import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

type LoginBody = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _accessToken: string | undefined;

  constructor(private http: HttpClient) {}

  /**
   * to be implemented with ionic storage
   */
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logIn(body: LoginBody): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('auth/login', body).pipe(
      map(response => {
        this.setAccessToken(response.access_token);
        return response;
      }),
    );
  }

  getAccessToken(): string | undefined {
    return this._accessToken;
  }

  setAccessToken(token: string | undefined): void {
    this._accessToken = token;
  }

  refreshToken(): Observable<{ access_token: string }> {
    return this.http.get<{ access_token: string }>('auth/refresh').pipe(
      map(response => {
        this.setAccessToken(response.access_token);
        return response;
      }),
    );
  }
}
