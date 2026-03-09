import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthHelper } from '../helpers/auth.helper';

export const authGuard: CanMatchFn | CanActivateFn = (
  route: any,
  segmentsOrState: any,
): boolean | UrlTree => {
  const authHelper = inject(AuthHelper);
  const router = inject(Router);
  return authHelper.isAuthenticated() || router.parseUrl('/auth/login');
};
