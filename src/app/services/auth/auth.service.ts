import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

type LoginBody = {
  email: string;
  password: string;
};
type RegisterBody = {
  username: string;
  email:string;
  firstname:string;
  lastname:string;
  birthdate: string;
  gender: string;
  password: string;
}

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
   * to be implemented
   */
  isLoggedIn(): boolean {
    return true;
  }

  logIn(body: LoginBody): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('auth/login', body).pipe(
      map(response => {
        this._accessToken = response.access_token;
        return response;
      }),
    );
  }
  register(body: RegisterBody): Observable<any>{
    return this.http.post<any>('auth/register', body).pipe(
      map(response => {
        this._accessToken = response.access_token;
        return response;
      })
    )
  }

  getAccessToken(): string | undefined {
    return this._accessToken;
  }

  refreshToken(): Observable<{ access_token: string }> {
    return this.http.get<{ access_token: string }>('auth/refresh').pipe(
      map(response => {
        this._accessToken = response.access_token;
        return response;
      }),
    );
  }
}
