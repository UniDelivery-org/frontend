import { createFeature, createReducer, on } from '@ngrx/store';
import { AdminUserState, initialState } from './admin-users.state';
import { adminUserActions } from './admin-users.actions';

export const adminUsersFeature = createFeature({
  name: 'adminUsers',
  reducer: createReducer(
    initialState,

    // ===== LOAD ALL USERS =====
    on(adminUserActions.loadAllUsers, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(adminUserActions.loadAllUsersSuccess, (state, { users }) => ({
      ...state,
      usersPage: users,
      isLoading: false,
    })),
    on(adminUserActions.loadAllUsersFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== BLOCK USER =====
    on(adminUserActions.blockUser, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(adminUserActions.blockUserSuccess, (state, { user }) => ({
      ...state,
      selectedUser: user,
      usersPage: state.usersPage
        ? {
            ...state.usersPage,
            content: state.usersPage.content.map((u) => (u.id === user.id ? user : u)),
          }
        : null,
      isLoading: false,
    })),
    on(adminUserActions.blockUserFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== UNBLOCK USER =====
    on(adminUserActions.unblockUser, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(adminUserActions.unblockUserSuccess, (state, { user }) => ({
      ...state,
      selectedUser: user,
      usersPage: state.usersPage
        ? {
            ...state.usersPage,
            content: state.usersPage.content.map((u) => (u.id === user.id ? user : u)),
          }
        : null,
      isLoading: false,
    })),
    on(adminUserActions.unblockUserFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),
  ),
});

export const {
  name: adminUsersFeatureKey,
  reducer: adminUsersReducer,
  selectUsersPage,
  selectSelectedUser,
  selectIsLoading,
  selectError,
} = adminUsersFeature;
