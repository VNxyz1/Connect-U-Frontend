import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

type LoginBody = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  /**
   * to be implemented
   */
  isLoggedIn(): boolean {
    return true;
  }

  //TODO: return type must be specified when the backend route is created
  logIn(body: LoginBody): Observable<Object> {
    return this.http.post('auth/login', body).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => new Error(error));
      }),
    );
  }
}
