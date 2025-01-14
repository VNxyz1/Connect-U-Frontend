import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import {
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  const refreshTokenSubject = new BehaviorSubject<string | null>(null);

  const accessToken = authService.getAccessToken();
  let authReq = req;

  if (accessToken) {
    authReq = addToken(authReq, accessToken);
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(authReq, next, authService, refreshTokenSubject);
      }
      return throwError(() => error);
    }),
  );
};

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  refreshTokenSubject: BehaviorSubject<string | null>,
): Observable<HttpEvent<any>> {
  if (!refreshTokenSubject.getValue()) {
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(res => {
        refreshTokenSubject.next(res.access_token);
        return next(addToken(request, res.access_token));
      }),
      catchError(err => {
        refreshTokenSubject.next(null);
        return throwError(() => err);
      }),
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => next(addToken(request, token!))),
    );
  }
}
