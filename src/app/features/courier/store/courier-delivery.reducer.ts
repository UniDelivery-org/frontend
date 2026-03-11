import { createFeature, createReducer, on } from '@ngrx/store';
import { CourierDeliveryState, initialState } from './courier-delivery.state';
import { courierDeliveryActions } from './courier-delivery.actions';

export const courierDeliveryFeature = createFeature({
  name: 'courierDelivery',
  reducer: createReducer(
    initialState,

    // ===== LOAD SINGLE DELIVERY =====
    on(courierDeliveryActions.loadDelivery, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(courierDeliveryActions.loadDeliverySuccess, (state, { delivery }) => ({
      ...state,
      delivery,
      isLoading: false,
    })),
    on(courierDeliveryActions.loadDeliveryFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== LOAD PENDING DELIVERIES (Available for pickup) =====
    on(courierDeliveryActions.loadPendingDeliveries, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(courierDeliveryActions.loadPendingDeliveriesSuccess, (state, { deliveries }) => ({
      ...state,
      pendingDeliveries: deliveries,
      isLoading: false,
    })),
    on(courierDeliveryActions.loadPendingDeliveriesFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== LOAD DRIVER DELIVERIES =====
    on(courierDeliveryActions.loadDriverDeliveries, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(courierDeliveryActions.loadDriverDeliveriesSuccess, (state, { deliveries }) => ({
      ...state,
      driverDeliveries: deliveries,
      isLoading: false,
    })),
    on(courierDeliveryActions.loadDriverDeliveriesFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== LOAD NEARBY DELIVERIES =====
    on(courierDeliveryActions.loadNearbyDeliveries, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(courierDeliveryActions.loadNearbyDeliveriesSuccess, (state, { deliveries }) => ({
      ...state,
      nearbyDeliveries: deliveries,
      isLoading: false,
    })),
    on(courierDeliveryActions.loadNearbyDeliveriesFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== ACCEPT DELIVERY =====
    on(courierDeliveryActions.acceptDelivery, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(courierDeliveryActions.acceptDeliverySuccess, (state, { delivery }) => ({
      ...state,
      delivery,
      isLoading: false,
    })),
    on(courierDeliveryActions.acceptDeliveryFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== UPDATE STATUS =====
    on(courierDeliveryActions.updateDeliveryStatus, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(courierDeliveryActions.updateDeliveryStatusSuccess, (state, { delivery }) => ({
      ...state,
      delivery,
      isLoading: false,
    })),
    on(courierDeliveryActions.updateDeliveryStatusFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== LOAD ACTIVE DELIVERY =====
    on(courierDeliveryActions.loadActiveDelivery, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(courierDeliveryActions.loadActiveDeliverySuccess, (state, { delivery }) => ({
      ...state,
      delivery,
      isLoading: false,
    })),
    on(courierDeliveryActions.loadActiveDeliveryFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== LOAD HISTORY =====
    on(courierDeliveryActions.loadDeliveryHistory, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(courierDeliveryActions.loadDeliveryHistorySuccess, (state, { deliveries }) => ({
      ...state,
      history: deliveries,
      isLoading: false,
    })),
    on(courierDeliveryActions.loadDeliveryHistoryFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),

    // ===== LOAD STATS =====
    on(courierDeliveryActions.loadCourierStats, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(courierDeliveryActions.loadCourierStatsSuccess, (state, { stats }) => ({
      ...state,
      stats,
      isLoading: false,
    })),
    on(courierDeliveryActions.loadCourierStatsFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),
  ),
});

export const {
  name: courierDeliveryFeatureKey,
  reducer: courierDeliveryReducer,
  selectCourierDeliveryState,
  selectDelivery,
  selectPendingDeliveries,
  selectDriverDeliveries,
  selectNearbyDeliveries,
  selectHistory,
  selectStats,
  selectIsLoading,
  selectError,
} = courierDeliveryFeature;
