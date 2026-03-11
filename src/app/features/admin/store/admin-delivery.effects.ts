import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AdminDeliveryApiService } from '../data-access/admin-delivery.api.service';
import { adminDeliveryActions } from './admin-delivery.actions';

export const loadAllDeliveriesEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(AdminDeliveryApiService)) =>
    actions$.pipe(
      ofType(adminDeliveryActions.loadAllDeliveries),
      mergeMap(({ status, page, size }) =>
        apiService.getAllDeliveries(status, page, size).pipe(
          map((deliveries) => adminDeliveryActions.loadAllDeliveriesSuccess({ deliveries })),
          catchError((error) =>
            of(
              adminDeliveryActions.loadAllDeliveriesFailure({
                error: error.error || { message: 'Failed to load all deliveries' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const cancelDeliveryEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(AdminDeliveryApiService)) =>
    actions$.pipe(
      ofType(adminDeliveryActions.cancelDelivery),
      mergeMap(({ deliveryId, reason }) =>
        apiService.forceCancelDelivery(deliveryId, reason).pipe(
          map((delivery) => adminDeliveryActions.cancelDeliverySuccess({ delivery })),
          catchError((error) =>
            of(
              adminDeliveryActions.cancelDeliveryFailure({
                error: error.error || { message: 'Failed to cancel delivery' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loadAdminStatsEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(AdminDeliveryApiService)) =>
    actions$.pipe(
      ofType(adminDeliveryActions.loadAdminStats),
      mergeMap(() =>
        apiService.getAdminStats().pipe(
          map((stats) => adminDeliveryActions.loadAdminStatsSuccess({ stats })),
          catchError((error) =>
            of(
              adminDeliveryActions.loadAdminStatsFailure({
                error: error.error || { message: 'Failed to load admin stats' },
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
