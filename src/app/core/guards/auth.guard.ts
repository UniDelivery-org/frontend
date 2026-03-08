import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from '../services/cookie.service';

export const authGuard: CanMatchFn | CanActivateFn = (
  route: any,
  segmentsOrState: any,
): boolean | UrlTree => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  if (cookieService.get('accessToken')) {
    return true;
  }
  return router.parseUrl('/auth/login');
};
