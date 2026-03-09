import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './profile.actions';
import { ProfileState } from './profile.state';

const initialUserState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};
export const profileFeature = createFeature({
  name: 'profile',
  reducer: createReducer(
    initialUserState,

    // load profile reduction
    on(profileActions.loadProfile, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(profileActions.loadProfileSuccess, (state, { profile }) => ({
      ...state,
      profile,
      isLoading: false,
    })),
    on(profileActions.loadProfileFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // update profile reduction
    on(profileActions.updateProfile, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(profileActions.updateProfileSuccess, (state, { profile }) => ({
      ...state,
      profile,
      isLoading: false,
    })),
    on(profileActions.updateProfileFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
    // delete profile reduction
    on(profileActions.deleteProfile, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(profileActions.deleteProfileSuccess, (state) => ({
      ...state,
      ...initialUserState,
    })),
    on(profileActions.deleteProfileFailure, (state) => ({
      ...state,
      ...initialUserState,
    })),
  ),
});

export const {
  name: profileFeatureKey,
  reducer: profileReducer,
  selectProfileState,
  selectIsLoading,
  selectError,
  selectProfile,
} = profileFeature;
