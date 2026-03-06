import { ApiError } from "../../../shared/models/api.error.model";
import { Profile } from "../../profile/profile";
import { Auth } from "../auth";

export interface AuthState {
  auth: Auth | null;
  registerResponse: Profile | null;
  isLoading: boolean;
  error: ApiError | null;
}
