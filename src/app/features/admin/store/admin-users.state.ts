import { Page } from '../../../shared/models/api.page.model';
import { ApiError } from '../../../shared/models/api.error.model';
import { Profile } from '../../profile/profile';

export interface AdminUserState {
  usersPage: Page<Profile> | null;
  selectedUser: Profile | null;
  isLoading: boolean;
  error: ApiError | null;
}

export const initialState: AdminUserState = {
  usersPage: null,
  selectedUser: null,
  isLoading: false,
  error: null,
};
