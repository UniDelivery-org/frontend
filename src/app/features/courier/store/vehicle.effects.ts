import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { VehicleApiService } from '../data-access/vehicle.api.service';
import { vehicleActions } from './vehicle.actions';
import { ApiError } from '../../../shared/models/api.error.model';

export const loadMyVehiclesEffect = createEffect(
  (actions$ = inject(Actions), vehicleApiService = inject(VehicleApiService)) =>
    actions$.pipe(
      ofType(vehicleActions.loadMyVehicles),
      mergeMap(({ page, size }) =>
        vehicleApiService.getMyVehicles(page, size).pipe(
          map((response) => vehicleActions.loadMyVehiclesSuccess({ response })),
          catchError((error: ApiError) => of(vehicleActions.loadMyVehiclesFailure({ error })))
        )
      )
    ),
  { functional: true }
);

export const loadActiveVehicleEffect = createEffect(
  (actions$ = inject(Actions), vehicleApiService = inject(VehicleApiService)) =>
    actions$.pipe(
      ofType(vehicleActions.loadActiveVehicle),
      mergeMap(() =>
        vehicleApiService.getMyActiveVehicle().pipe(
          map((vehicle) => vehicleActions.loadActiveVehicleSuccess({ vehicle })),
          catchError((error: ApiError) => of(vehicleActions.loadActiveVehicleFailure({ error })))
        )
      )
    ),
  { functional: true }
);

export const createVehicleEffect = createEffect(
  (actions$ = inject(Actions), vehicleApiService = inject(VehicleApiService)) =>
    actions$.pipe(
      ofType(vehicleActions.createVehicle),
      mergeMap(({ payload }) =>
        vehicleApiService.createVehicle(payload).pipe(
          map((vehicle) => vehicleActions.createVehicleSuccess({ vehicle })),
          catchError((error: ApiError) => of(vehicleActions.createVehicleFailure({ error })))
        )
      )
    ),
  { functional: true }
);

export const setActiveVehicleEffect = createEffect(
  (actions$ = inject(Actions), vehicleApiService = inject(VehicleApiService)) =>
    actions$.pipe(
      ofType(vehicleActions.setActiveVehicle),
      mergeMap(({ vehicleId }) =>
        vehicleApiService.setActiveVehicle(vehicleId).pipe(
          map((vehicle) => vehicleActions.setActiveVehicleSuccess({ vehicle })),
          catchError((error: ApiError) => of(vehicleActions.setActiveVehicleFailure({ error })))
        )
      )
    ),
  { functional: true }
);

export const searchVehiclesEffect = createEffect(
  (actions$ = inject(Actions), vehicleApiService = inject(VehicleApiService)) =>
    actions$.pipe(
      ofType(vehicleActions.searchVehicles),
      mergeMap(({ filter }) =>
        vehicleApiService.searchVehicles(filter).pipe(
          map((response) => vehicleActions.searchVehiclesSuccess({ response })),
          catchError((error: ApiError) => of(vehicleActions.searchVehiclesFailure({ error })))
        )
      )
    ),
  { functional: true }
);

export const verifyVehicleEffect = createEffect(
  (actions$ = inject(Actions), vehicleApiService = inject(VehicleApiService)) =>
    actions$.pipe(
      ofType(vehicleActions.verifyVehicle),
      mergeMap(({ vehicleId, request }) =>
        vehicleApiService.verifyVehicle(vehicleId, request).pipe(
          map((vehicle) => vehicleActions.verifyVehicleSuccess({ vehicle })),
          catchError((error: ApiError) => of(vehicleActions.verifyVehicleFailure({ error })))
        )
      )
    ),
  { functional: true }
);
