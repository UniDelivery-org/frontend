import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '../profile';
import { ApiError } from '../../../shared/models/api.error.model';
import { UpdateProfileRequestDTO } from '../data-access/update-profile.dto';

export const profileActions = createActionGroup({
  source: 'profile',
  events: {
    'Load Profile': emptyProps(),
    'Load Profile Success': props<{ profile: Profile }>(),
    'Load Profile Failure': props<{ error: ApiError }>(),

    'Update Profile': props<{ updateProfileDto: UpdateProfileRequestDTO }>(),
    'Update Profile Success': props<{ profile: Profile }>(),
    'Update Profile Failure': props<{ error: ApiError }>(),

    'Delete Profile': emptyProps(),
    'Delete Profile Success': emptyProps(),
    'Delete Profile Failure': props<{ error: ApiError }>(),
  },
});
