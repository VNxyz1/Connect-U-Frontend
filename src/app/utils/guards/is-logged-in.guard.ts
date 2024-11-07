import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const isLoggedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loggedIn = inject(AuthService).isLoggedIn();
  if (!loggedIn) {
    const landingpage = router.parseUrl('/welcome');
    return new RedirectCommand(landingpage);
  }
  return loggedIn;
};
