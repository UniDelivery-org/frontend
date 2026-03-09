import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from '../services/cookie.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const cookie = inject(CookieService);
  const accessToken = cookie.get('accessToken');
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return next(clonedReq);
};
