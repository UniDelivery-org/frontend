import { AuthState } from "../../features/auth/store/auth.state";
import { ProfileState } from "../../features/profile/store/profile.state";

export interface AppState {
  auth: AuthState;
  profile: ProfileState;
}
