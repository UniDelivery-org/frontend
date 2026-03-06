import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { authActions } from './auth.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthService } from '../data-access/auth.api.service';


export const loginEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(authActions.login),
      mergeMap(({ loginDto }) =>
        authService.login(loginDto).pipe(
          map((auth) => authActions.loginSuccess({ auth })),
          catchError((error) => of(authActions.loginFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const registerEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(authActions.register),
      mergeMap(({ registerDto }) =>
        authService.register(registerDto).pipe(
          map((registerResponse) => authActions.registerSuccess({ registerResponse })),
          catchError((error) => of(authActions.registerFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const logoutProfileEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(authActions.logoutProfile),
      mergeMap(() =>
        authService.logout().pipe(
          map(() => authActions.logoutProfileSuccess()),
          catchError(() => of(authActions.logoutProfileFailure())),
        ),
      ),
    ),
  { functional: true },
);
