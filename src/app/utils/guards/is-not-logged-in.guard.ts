import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export const isNotLoggedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLoggedIn().pipe(
    map(loggedIn => {
      if (loggedIn) {
        const landingpage = router.parseUrl('');
        return new RedirectCommand(landingpage);
      }
      return true;
    }),
    catchError(() => {
      const landingpage = router.parseUrl('');
      return of(new RedirectCommand(landingpage));
    }),
  );
};
