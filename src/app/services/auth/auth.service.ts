import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, map, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private translocoService: TranslocoService,
  ) {}

  isLoggedIn(): Observable<boolean> {
    return from(this.refreshLoginStatus()).pipe(
      switchMap(() => this.isLoggedInSubject.asObservable()),
    );
  }

  private refreshLoginStatus(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.get<{ loggedIn: boolean }>('auth/check-login').subscribe({
        next: res => {
          this.isLoggedInSubject.next(res.loggedIn);
          resolve();
        },
        error: err => {
          this.isLoggedInSubject.next(false);
          reject(err);
        },
      });
    });
  }

  logIn(body: LoginBody): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('auth/login', body).pipe(
      map(response => {
        this.setAccessToken(response.access_token);
        this.refreshLoginStatus();
        return response;
      }),
    );
  }

  register(body: RegisterBody): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('user', body).pipe(
      switchMap(res => {
        this.setAccessToken(res.access_token);
        return from(this.refreshLoginStatus()).pipe(map(() => res));
      }),
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
    return this.http
      .delete<{ ok: boolean; message: string }>('auth/logout')
      .pipe(
        map(res => {
          this.setAccessToken(undefined);
          this.refreshLoginStatus();
          return res;
        }),
      );
  }

  checkBackendHealth() {
    return this.http.get<{ ok: boolean; message: string }>('health');
  }
}
