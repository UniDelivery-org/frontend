import { ApiError } from '../../../shared/models/api.error.model';
import { Profile } from '../profile';

export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: ApiError | null;
}
