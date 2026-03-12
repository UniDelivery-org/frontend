import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Role } from '../../../core/models/models';
import { ApiError } from '../../../shared/models/api.error.model';
import { Page } from '../../../shared/models/api.page.model';
import { Profile } from '../../profile/profile';

export const adminUserActions = createActionGroup({
  source: 'Admin Users',
  events: {
    // Load All Users
    'Load All Users': props<{ search?: string; role?: Role; page?: number; size?: number }>(),
    'Load All Users Success': props<{ users: Page<Profile> }>(),
    'Load All Users Failure': props<{ error: ApiError }>(),

    // Block User
    'Block User': props<{ userId: string; reason?: string }>(),
    'Block User Success': props<{ user: Profile }>(),
    'Block User Failure': props<{ error: ApiError }>(),

    // Unblock User
    'Unblock User': props<{ userId: string }>(),
    'Unblock User Success': props<{ user: Profile }>(),
    'Unblock User Failure': props<{ error: ApiError }>(),
  },
});
