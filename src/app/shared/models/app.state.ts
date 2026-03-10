import { AuthState } from "../../features/auth/store/auth.state";
import { ProfileState } from "../../features/profile/store/profile.state";
import { SenderDeliveryState } from "../../features/sender/store/sender-delivery.state";

export interface AppState {
  auth: AuthState;
  profile: ProfileState;
  senderDelivery: SenderDeliveryState;
}
