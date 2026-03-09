import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from '../services/cookie.service';
import { AuthHelper } from '../helpers/auth.helper';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const cookie = inject(CookieService);
  const authHelper = inject(AuthHelper);
  const accessToken = cookie.get('accessToken');
  if (authHelper.isAuthenticated()) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next(clonedReq);
  }
  return next(req);
};
