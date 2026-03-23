import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/data-access/auth.api.service';
import { CookieService } from '../services/cookie.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { authActions } from '../../features/auth/store/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const cookie = inject(CookieService);
  const store = inject(Store);
  const router = inject(Router);
  const toast = inject(ToastService);
  
  const token = cookie.get('accessToken');
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 409 && err.error?.errorCode === 'USER_BLOCKED') {
        store.dispatch(authActions.logoutProfile());
        
        setTimeout(() => {
          toast.showError('Compte bloqué', "Votre compte a été restreint par un administrateur. L'accès est refusé.");
        }, 300);
        
        router.navigate(['/auth/login']);
        return throwError(() => err);
      }

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
