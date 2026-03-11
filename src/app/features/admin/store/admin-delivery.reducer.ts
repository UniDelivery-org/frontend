import { createFeature, createReducer, on } from '@ngrx/store';
import { AdminDeliveryState, initialState } from './admin-delivery.state';
import { adminDeliveryActions } from './admin-delivery.actions';

export const adminDeliveryFeature = createFeature({
  name: 'adminDelivery',
  reducer: createReducer(
    initialState,

    // ===== LOAD ALL DELIVERIES =====
    on(adminDeliveryActions.loadAllDeliveries, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(adminDeliveryActions.loadAllDeliveriesSuccess, (state, { deliveries }) => ({
      ...state,
      allDeliveries: deliveries,
      isLoading: false,
    })),
    on(adminDeliveryActions.loadAllDeliveriesFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== CANCEL DELIVERY =====
    on(adminDeliveryActions.cancelDelivery, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(adminDeliveryActions.cancelDeliverySuccess, (state, { delivery }) => ({
      ...state,
      selectedDelivery: delivery,
      isLoading: false,
    })),
    on(adminDeliveryActions.cancelDeliveryFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== LOAD STATS =====
    on(adminDeliveryActions.loadAdminStats, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(adminDeliveryActions.loadAdminStatsSuccess, (state, { stats }) => ({
      ...state,
      stats,
      isLoading: false,
    })),
    on(adminDeliveryActions.loadAdminStatsFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),
  ),
});

export const {
  name: adminDeliveryFeatureKey,
  reducer: adminDeliveryReducer,
  selectAllDeliveries,
  selectSelectedDelivery,
  selectStats,
  selectIsLoading,
  selectError,
} = adminDeliveryFeature;
