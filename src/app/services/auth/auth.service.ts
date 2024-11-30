import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslocoService } from '@jsverse/transloco';

type LoginBody = {
  email: string;
  password: string;
};
export type RegisterBody = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: string;
  gender: number;
  password: string;
  passwordConfirm: string;
  agb: boolean;
};

type AuthResponse = {
  access_token: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _accessToken: string | undefined;

  constructor(
    private http: HttpClient,
    private translocoService: TranslocoService,
  ) {}

  isLoggedIn(): Observable<boolean> {
    return this.http.get<{ loggedIn: boolean }>('auth/check-login').pipe(
      map(res => {
        return res.loggedIn;
      }),
    );
  }

  async isLoggedInAsync(): Promise<boolean | undefined> {
    return this.isLoggedIn().toPromise();
  }

  logIn(body: LoginBody): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('auth/login', body).pipe(
      map(response => {
        this.setAccessToken(response.access_token);
        return response;
      }),
    );
  }

  register(body: RegisterBody): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('user', body).pipe(
      catchError(error => {
        const backendMessage = error.error?.message || 'Unknown error';
        const translatedMessage = this.translocoService.translate(
          `registerComponentErrors.${backendMessage}`,
          { defaultValue: backendMessage },
        );
        return throwError(() => new Error(translatedMessage));
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

  logout() {
    return this.http.delete<{ ok: boolean, message: string }>('auth/logout').pipe(
      tap(res => {
        this.setAccessToken(undefined);
        return res;
      })
    );
  }
}
