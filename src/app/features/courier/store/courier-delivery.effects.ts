import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CourierDeliveryApiService } from '../data-access/courier-delivery.api.service';
import { courierDeliveryActions } from './courier-delivery.actions';

export const loadDeliveryEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(CourierDeliveryApiService)) =>
    actions$.pipe(
      ofType(courierDeliveryActions.loadDelivery),
      mergeMap(({ id }) =>
        apiService.getDelivery(id).pipe(
          map((delivery) => courierDeliveryActions.loadDeliverySuccess({ delivery })),
          catchError((error) =>
            of(
              courierDeliveryActions.loadDeliveryFailure({
                error: error.error || { message: 'Failed to load delivery' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loadPendingDeliveriesEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(CourierDeliveryApiService)) =>
    actions$.pipe(
      ofType(courierDeliveryActions.loadPendingDeliveries),
      mergeMap(({ page, size }) =>
        apiService.getPendingDeliveries(page, size).pipe(
          map((deliveries) => courierDeliveryActions.loadPendingDeliveriesSuccess({ deliveries })),
          catchError((error) =>
            of(
              courierDeliveryActions.loadPendingDeliveriesFailure({
                error: error.error || { message: 'Failed to load pending deliveries' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loadDriverDeliveriesEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(CourierDeliveryApiService)) =>
    actions$.pipe(
      ofType(courierDeliveryActions.loadDriverDeliveries),
      mergeMap(({ driverId, page, size }) =>
        apiService.getDriverDeliveries(driverId, page, size).pipe(
          map((deliveries) => courierDeliveryActions.loadDriverDeliveriesSuccess({ deliveries })),
          catchError((error) =>
            of(
              courierDeliveryActions.loadDriverDeliveriesFailure({
                error: error.error || { message: 'Failed to load driver deliveries' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loadNearbyDeliveriesEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(CourierDeliveryApiService)) =>
    actions$.pipe(
      ofType(courierDeliveryActions.loadNearbyDeliveries),
      mergeMap(({ driverId, radius, page, size }) =>
        apiService.getDriverNearbyDeliveries(driverId, radius, page, size).pipe(
          map((deliveries) => courierDeliveryActions.loadNearbyDeliveriesSuccess({ deliveries })),
          catchError((error) =>
            of(
              courierDeliveryActions.loadNearbyDeliveriesFailure({
                error: error.error || { message: 'Failed to load nearby deliveries' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const acceptDeliveryEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(CourierDeliveryApiService)) =>
    actions$.pipe(
      ofType(courierDeliveryActions.acceptDelivery),
      mergeMap(({ deliveryId, driverId }) =>
        apiService.acceptDelivery(deliveryId, driverId).pipe(
          map((delivery) => courierDeliveryActions.acceptDeliverySuccess({ delivery })),
          catchError((error) =>
            of(
              courierDeliveryActions.acceptDeliveryFailure({
                error: error.error || { message: 'Failed to accept delivery' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const updateDeliveryStatusEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(CourierDeliveryApiService)) =>
    actions$.pipe(
      ofType(courierDeliveryActions.updateDeliveryStatus),
      mergeMap(({ deliveryId, status }) =>
        apiService.updateDeliveryStatus(deliveryId, status).pipe(
          map((delivery) => courierDeliveryActions.updateDeliveryStatusSuccess({ delivery })),
          catchError((error) =>
            of(
              courierDeliveryActions.updateDeliveryStatusFailure({
                error: error.error || { message: 'Failed to update status' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loadActiveDeliveryEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(CourierDeliveryApiService)) =>
    actions$.pipe(
      ofType(courierDeliveryActions.loadActiveDelivery),
      mergeMap(({ driverId }) =>
        apiService.getDriverActiveDelivery(driverId).pipe(
          map((delivery) => courierDeliveryActions.loadActiveDeliverySuccess({ delivery })),
          catchError((error) =>
            of(
              courierDeliveryActions.loadActiveDeliveryFailure({
                error: error.error || { message: 'Failed to load active delivery' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loadDeliveryHistoryEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(CourierDeliveryApiService)) =>
    actions$.pipe(
      ofType(courierDeliveryActions.loadDeliveryHistory),
      mergeMap(({ driverId, status, page, size }) =>
        apiService.getDriverDeliveryHistory(driverId, status, page, size).pipe(
          map((deliveries) => courierDeliveryActions.loadDeliveryHistorySuccess({ deliveries })),
          catchError((error) =>
            of(
              courierDeliveryActions.loadDeliveryHistoryFailure({
                error: error.error || { message: 'Failed to load delivery history' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loadCourierStatsEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(CourierDeliveryApiService)) =>
    actions$.pipe(
      ofType(courierDeliveryActions.loadCourierStats),
      mergeMap(({ driverId }) =>
        apiService.getCourierStats(driverId).pipe(
          map((stats) => courierDeliveryActions.loadCourierStatsSuccess({ stats })),
          catchError((error) =>
            of(
              courierDeliveryActions.loadCourierStatsFailure({
                error: error.error || { message: 'Failed to load courier stats' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
