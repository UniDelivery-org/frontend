import { createActionGroup, emptyProps, props } from "@ngrx/store";
import {LoginDto} from "../data-access/login.dto";
import { RegisterDto } from "../data-access/register.dto";
import { Auth } from "../auth";
import { Profile } from "../../profile/profile";
import { ApiError } from "../../../shared/models/api.error.model";

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    Login: props<{ loginDto: LoginDto }>(),
    'Login Success': props<{ auth: Auth }>(),
    'Login Failure': props<{ error: ApiError }>(),

    Register: props<{ registerDto: RegisterDto }>(),
    'Register Success': props<{ registerResponse: Profile }>(),
    'Register Failure': props<{ error: ApiError }>(),

    'Logout Profile': emptyProps(),
    'Logout Profile Success': emptyProps(),
    'Logout Profile Failure': emptyProps(),
  },
});
