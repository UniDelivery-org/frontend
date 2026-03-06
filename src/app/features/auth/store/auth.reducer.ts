import { createFeature, createReducer, on } from "@ngrx/store";
import { authActions } from "./auth.actions";
import { AuthState } from "./auth.state";

const initialUserState: AuthState = {
  auth: null,
  registerResponse: null,
  isLoading: false,
  error: null
}
export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialUserState,

    // Login reduction
    on(authActions.login, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(authActions.loginSuccess, (state, { auth }) => ({
      ...state,
      auth,
      isLoading: false,
    })),
    on(authActions.loginFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // register reduction
    on(authActions.register, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(authActions.registerSuccess, (state, { registerResponse }) => ({
      ...state,
      registerResponse,
      isLoading: false,
    })),
    on(authActions.registerFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
    // logout user reduction
    on(authActions.logoutProfile, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(authActions.logoutProfileSuccess, (state) => ({
      ...state,
      ...initialUserState
    })),
    on(authActions.logoutProfileFailure, (state) => ({
      ...state,
      ...initialUserState
    })),
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectAuthState,
  selectIsLoading,
  selectError,
  selectRegisterResponse,
  selectAuth
} = authFeature;
