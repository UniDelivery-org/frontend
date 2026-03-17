import { createFeature, createReducer, on } from '@ngrx/store';
import { vehicleActions } from './vehicle.actions';
import { initialVehicleState } from './vehicle.state';

export const vehicleFeature = createFeature({
  name: 'vehicle',
  reducer: createReducer(
    initialVehicleState,

    // Load My Vehicles
    on(vehicleActions.loadMyVehicles, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(vehicleActions.loadMyVehiclesSuccess, (state, { response }) => ({
      ...state,
      myVehicles: response.content,
      totalElements: response.totalElements,
      isLoading: false,
    })),
    on(vehicleActions.loadMyVehiclesFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Load Active Vehicle
    on(vehicleActions.loadActiveVehicle, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(vehicleActions.loadActiveVehicleSuccess, (state, { vehicle }) => ({
      ...state,
      activeVehicle: vehicle,
      isLoading: false,
    })),
    on(vehicleActions.loadActiveVehicleFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      // 404 is common for no active vehicle, maybe don't treat as a hard error for the whole UI
      error: error.status === 404 ? null : error,
    })),

    // Create Vehicle
    on(vehicleActions.createVehicle, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(vehicleActions.createVehicleSuccess, (state, { vehicle }) => ({
      ...state,
      myVehicles: [vehicle, ...state.myVehicles],
      isLoading: false,
    })),
    on(vehicleActions.createVehicleFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Set Active Vehicle
    on(vehicleActions.setActiveVehicle, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(vehicleActions.setActiveVehicleSuccess, (state, { vehicle }) => ({
      ...state,
      activeVehicle: vehicle,
      myVehicles: state.myVehicles.map(v => ({
        ...v,
        isActive: v.id === vehicle.id
      })),
      isLoading: false,
    })),
    on(vehicleActions.setActiveVehicleFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Search Vehicles
    on(vehicleActions.searchVehicles, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(vehicleActions.searchVehiclesSuccess, (state, { response }) => ({
      ...state,
      searchResults: response.content,
      totalElements: response.totalElements,
      isLoading: false,
    })),
    on(vehicleActions.searchVehiclesFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Verify Vehicle
    on(vehicleActions.verifyVehicle, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(vehicleActions.verifyVehicleSuccess, (state, { vehicle }) => ({
      ...state,
      searchResults: state.searchResults.map((v) =>
        v.id === vehicle.id ? vehicle : v
      ),
      myVehicles: state.myVehicles.map((v) =>
        v.id === vehicle.id ? vehicle : v
      ),
      isLoading: false,
    })),
    on(vehicleActions.verifyVehicleFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
  ),
});

export const {
  name: vehicleFeatureKey,
  reducer: vehicleReducer,
  selectVehicleState,
  selectMyVehicles,
  selectActiveVehicle,
  selectSearchResults,
  selectTotalElements,
  selectIsLoading,
  selectError,
} = vehicleFeature;
