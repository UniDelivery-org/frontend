import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { paymentActions } from './payment.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { WalletApiService } from '../data-access/wallet.api.service';
import { TransactionApiService } from '../data-access/transaction.api.service';
import { StripeApiService } from '../data-access/stripe.api.service';

export const loadWalletEffect = createEffect(
  (actions$ = inject(Actions), walletService = inject(WalletApiService)) =>
    actions$.pipe(
      ofType(paymentActions.loadWallet),
      mergeMap(({ ownerId }) =>
        walletService.getWallet(ownerId).pipe(
          map((wallet) => paymentActions.loadWalletSuccess({ wallet })),
          catchError((error) => of(paymentActions.loadWalletFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const initializeWalletEffect = createEffect(
  (actions$ = inject(Actions), walletService = inject(WalletApiService)) =>
    actions$.pipe(
      ofType(paymentActions.initializeWallet),
      mergeMap(({ ownerId }) =>
        walletService.initializeWallet(ownerId).pipe(
          map((wallet) => paymentActions.initializeWalletSuccess({ wallet })),
          catchError((error) => of(paymentActions.initializeWalletFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const loadTransactionsEffect = createEffect(
  (actions$ = inject(Actions), transactionService = inject(TransactionApiService)) =>
    actions$.pipe(
      ofType(paymentActions.loadTransactions),
      mergeMap(({ walletId }) =>
        transactionService.getWalletTransactions(walletId).pipe(
          map((transactions) => paymentActions.loadTransactionsSuccess({ transactions })),
          catchError((error) => of(paymentActions.loadTransactionsFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const recordTransactionEffect = createEffect(
  (actions$ = inject(Actions), transactionService = inject(TransactionApiService)) =>
    actions$.pipe(
      ofType(paymentActions.recordTransaction),
      mergeMap(({ request }) =>
        transactionService.recordTransaction(request).pipe(
          map((transaction) => paymentActions.recordTransactionSuccess({ transaction })),
          catchError((error) => of(paymentActions.recordTransactionFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const createPaymentIntentEffect = createEffect(
  (actions$ = inject(Actions), stripeService = inject(StripeApiService)) =>
    actions$.pipe(
      ofType(paymentActions.createPaymentIntent),
      mergeMap(({ request }) =>
        stripeService.createPaymentIntent(request).pipe(
          map((response) => paymentActions.createPaymentIntentSuccess({ response })),
          catchError((error) => of(paymentActions.createPaymentIntentFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);
