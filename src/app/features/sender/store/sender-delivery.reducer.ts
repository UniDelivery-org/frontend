import { createFeature, createReducer, on } from "@ngrx/store";
import { senderDeliveryActions } from "./sender-delivery.actions";
import { SenderDeliveryState } from "./sender-delivery.state";
import { DeliveryResponseDTO } from "../data-access/delivery.dto";

const initialState: SenderDeliveryState = {
  delivery: null,
  deliveries: null,
  stats: null,
  isLoading: false,
  error: null,
};
export const senderDeliveryFeature = createFeature({
    name: 'senderDelivery',
    
    reducer: createReducer(
        initialState,
        on(senderDeliveryActions.loadDelivery, (state) => ({
            ...state,
            isLoading: true,
            error: null,
        })),
        on(senderDeliveryActions.loadDeliverySuccess, (state, { delivery }) => ({
            ...state,
            delivery,
            isLoading: false,
        })),
        on(senderDeliveryActions.loadDeliveryFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error,
        })),
        on(senderDeliveryActions.createDelivery, (state) => ({
            ...state,
            isLoading: true,
            error: null,
        })),
        on(senderDeliveryActions.createDeliverySuccess, (state, { delivery }) => ({
            ...state,
            delivery,
            isLoading: false,
        })),
        on(senderDeliveryActions.createDeliveryFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error,
        })),
        on(senderDeliveryActions.updateDelivery, (state) => ({
            ...state,
            isLoading: true,
            error: null,
        })),
        on(senderDeliveryActions.updateDeliverySuccess, (state, { delivery }) => ({
            ...state,
            delivery,
            isLoading: false,
        })),
        on(senderDeliveryActions.updateDeliveryFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error,
        })),
        on(senderDeliveryActions.deleteDelivery, (state) => ({
            ...state,
            isLoading: true,
            error: null,
        })),
        on(senderDeliveryActions.deleteDeliverySuccess, (state) => ({
            ...state,
            isLoading: false,
        })),
        on(senderDeliveryActions.deleteDeliveryFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error,
        })),
        on(senderDeliveryActions.loadCustomerDeliveries, (state) => ({
            ...state,
            isLoading: true,
            error: null,
        })),
        on(senderDeliveryActions.loadCustomerDeliveriesSuccess, (state, { deliveries }) => ({
            ...state,
            deliveries,
            isLoading: false,
        })),
        on(senderDeliveryActions.loadCustomerDeliveriesFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error,
        })),
        on(senderDeliveryActions.loadActiveDeliveries, (state) => ({
            ...state,
            isLoading: true,
            error: null,
        })),
        on(senderDeliveryActions.loadActiveDeliveriesSuccess, (state, { deliveries }) => ({
            ...state,
            deliveries,
            isLoading: false,
        })),
        on(senderDeliveryActions.loadActiveDeliveriesFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error,
        })),
        on(senderDeliveryActions.loadDeliveryHistory, (state) => ({
            ...state,
            isLoading: true,
            error: null,
        })),
        on(senderDeliveryActions.loadDeliveryHistorySuccess, (state, { deliveries }) => ({
            ...state,
            deliveries,
            isLoading: false,
        })),
        on(senderDeliveryActions.loadDeliveryHistoryFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error,
        })),
        on(senderDeliveryActions.loadSenderStats, (state) => ({
            ...state,
            isLoading: true,
            error: null,
        })),
        on(senderDeliveryActions.loadSenderStatsSuccess, (state, { stats }) => ({
            ...state,
            stats,
            isLoading: false,
        })),
        on(senderDeliveryActions.loadSenderStatsFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error,
        })),
    ),
})

export const {
  name: senderDeliveryFeatureKey,
  reducer: senderDeliveryReducer,
  selectSenderDeliveryState,
  selectStats,
  selectIsLoading,
  selectError,
} = senderDeliveryFeature;