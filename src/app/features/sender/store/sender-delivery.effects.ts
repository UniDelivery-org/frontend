import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { senderDeliveryActions } from './sender-delivery.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { SenderDeliveryApiService } from '../data-access/sender-delivery.api.service';

export const loadDeliveryEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(SenderDeliveryApiService)) =>
    actions$.pipe(
      ofType(senderDeliveryActions.loadDelivery),
      mergeMap(({ id }) =>
        apiService.getDelivery(id).pipe(
          map((delivery) => senderDeliveryActions.loadDeliverySuccess({ delivery })),
          catchError((error) => of(senderDeliveryActions.loadDeliveryFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const createDeliveryEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(SenderDeliveryApiService)) =>
    actions$.pipe(
      ofType(senderDeliveryActions.createDelivery),
      mergeMap(({ deliveryRequest }) =>
        apiService.createDelivery(deliveryRequest).pipe(
          map((delivery) => {
            location.replace('/dashboard');
            return senderDeliveryActions.createDeliverySuccess({ delivery })
          }),
          catchError((error) => of(senderDeliveryActions.createDeliveryFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const updateDeliveryEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(SenderDeliveryApiService)) =>
    actions$.pipe(
      ofType(senderDeliveryActions.updateDelivery),
      mergeMap(({ id, deliveryRequest }) =>
        apiService.updateDelivery(id, deliveryRequest).pipe(
          map((delivery) => senderDeliveryActions.updateDeliverySuccess({ delivery })),
          catchError((error) => of(senderDeliveryActions.updateDeliveryFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const deleteDeliveryEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(SenderDeliveryApiService)) =>
    actions$.pipe(
      ofType(senderDeliveryActions.deleteDelivery),
      mergeMap(({ id }) =>
        apiService.deleteDelivery(id).pipe(
          map(() => {
            location.replace('/activity');
            return senderDeliveryActions.deleteDeliverySuccess()
          }),
          catchError((error) => of(senderDeliveryActions.deleteDeliveryFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const loadCustomerDeliveriesEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(SenderDeliveryApiService)) =>
    actions$.pipe(
      ofType(senderDeliveryActions.loadCustomerDeliveries),
      mergeMap(({ customerId, page, size }) =>
        apiService.getCustomerDeliveries(customerId, page, size).pipe(
          map((pageData) =>
            senderDeliveryActions.loadCustomerDeliveriesSuccess({ deliveries: pageData }),
          ),
          catchError((error) => of(senderDeliveryActions.loadCustomerDeliveriesFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const loadActiveDeliveriesEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(SenderDeliveryApiService)) =>
    actions$.pipe(
      ofType(senderDeliveryActions.loadActiveDeliveries),
      mergeMap(({ customerId, page, size }) =>
        apiService.getActiveDeliveries(customerId, page, size).pipe(
          map((pageData) =>
            senderDeliveryActions.loadActiveDeliveriesSuccess({ deliveries: pageData }),
          ),
          catchError((error) => of(senderDeliveryActions.loadActiveDeliveriesFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const loadDeliveryHistoryEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(SenderDeliveryApiService)) =>
    actions$.pipe(
      ofType(senderDeliveryActions.loadDeliveryHistory),
      mergeMap(({ customerId, status, page, size }) =>
        apiService.getDeliveryHistory(customerId, status, page, size).pipe(
          map((pageData) =>
            senderDeliveryActions.loadDeliveryHistorySuccess({ deliveries: pageData }),
          ),
          catchError((error) => of(senderDeliveryActions.loadDeliveryHistoryFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const loadSenderStatsEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(SenderDeliveryApiService)) =>
    actions$.pipe(
      ofType(senderDeliveryActions.loadSenderStats),
      mergeMap(({ customerId }) =>
        apiService.getSenderStats(customerId).pipe(
          map((stats) => senderDeliveryActions.loadSenderStatsSuccess({ stats })),
          catchError((error) => of(senderDeliveryActions.loadSenderStatsFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);
