import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { adminUserActions } from './admin-users.actions';
import { AdminUserApiService } from '../data-access/admin-user.api.service';

@Injectable()
export class AdminUserEffects {
  private actions$ = inject(Actions);
  private apiService = inject(AdminUserApiService);

  loadAllUsersEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(adminUserActions.loadAllUsers),
      mergeMap((action) =>
        this.apiService.getAllUsers(action.search, action.role, action.page, action.size).pipe(
          map((users) => adminUserActions.loadAllUsersSuccess({ users })),
          catchError((error) => of(adminUserActions.loadAllUsersFailure({ error }))),
        ),
      ),
    ),
  );

  blockUserEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(adminUserActions.blockUser),
      mergeMap((action) =>
        this.apiService.blockUser(action.userId, action.reason).pipe(
          map((user) => adminUserActions.blockUserSuccess({ user })),
          catchError((error) => of(adminUserActions.blockUserFailure({ error }))),
        ),
      ),
    ),
  );

  unblockUserEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(adminUserActions.unblockUser),
      mergeMap((action) =>
        this.apiService.unblockUser(action.userId).pipe(
          map((user) => adminUserActions.unblockUserSuccess({ user })),
          catchError((error) => of(adminUserActions.unblockUserFailure({ error }))),
        ),
      ),
    ),
  );
}
