import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './profile.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ProfileService } from '../data-access/profile.api.service';

export const loadProfileEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) =>
    actions$.pipe(
      ofType(profileActions.loadProfile),
      mergeMap(() =>
        profileService.load().pipe(
          map((profile) => profileActions.loadProfileSuccess({ profile })),
          catchError((error) => of(profileActions.loadProfileFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const updateProfileEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) =>
    actions$.pipe(
      ofType(profileActions.updateProfile),
      mergeMap(({ updateProfileDto }) =>
        profileService.update(updateProfileDto).pipe(
          map((profile) => profileActions.updateProfileSuccess({ profile })),
          catchError((error) => of(profileActions.updateProfileFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const logoutProfileEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) =>
    actions$.pipe(
      ofType(profileActions.deleteProfile),
      mergeMap(() =>
        profileService.delete().pipe(
          map(() => profileActions.deleteProfileSuccess()),
          catchError((error) => of(profileActions.deleteProfileFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);
