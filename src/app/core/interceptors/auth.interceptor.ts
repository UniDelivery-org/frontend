import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/data-access/auth.api.service';
import { CookieService } from '../services/cookie.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const cookie = inject(CookieService);
  const token = cookie.get('accessToken');
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((auth) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${auth.accessToken}` },
            });

            return next(retryReq);
          }),
        );
      }
      return throwError(() => err);
    }),
  );
};
