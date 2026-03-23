import { createFeature, createReducer, on } from "@ngrx/store";
import { paymentActions } from "./payment.actions";
import { PaymentState } from "./payment.state";

const initialPaymentState: PaymentState = {
  wallet: null,
  transactions: [],
  clientSecret: null,
  isLoading: false,
  error: null
}

export const paymentFeature = createFeature({
  name: 'payment',
  reducer: createReducer(
    initialPaymentState,

    // Load Wallet
    on(paymentActions.loadWallet, (state) => ({
      ...state,
      isLoading: true,
      error: null
    })),
    on(paymentActions.loadWalletSuccess, (state, { wallet }) => ({
      ...state,
      wallet,
      isLoading: false,
    })),
    on(paymentActions.loadWalletFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Initialize Wallet
    on(paymentActions.initializeWallet, (state) => ({
      ...state,
      isLoading: true,
      error: null
    })),
    on(paymentActions.initializeWalletSuccess, (state, { wallet }) => ({
      ...state,
      wallet,
      isLoading: false,
    })),
    on(paymentActions.initializeWalletFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Load Transactions
    on(paymentActions.loadTransactions, (state) => ({
      ...state,
      isLoading: true,
      error: null
    })),
    on(paymentActions.loadTransactionsSuccess, (state, { transactions }) => ({
      ...state,
      transactions,
      isLoading: false,
    })),
    on(paymentActions.loadTransactionsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Record Transaction
    on(paymentActions.recordTransaction, (state) => ({
      ...state,
      isLoading: true,
      error: null
    })),
    on(paymentActions.recordTransactionSuccess, (state, { transaction }) => ({
      ...state,
      transactions: [transaction, ...state.transactions],
      isLoading: false,
    })),
    on(paymentActions.recordTransactionFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Create Payment Intent
    on(paymentActions.createPaymentIntent, (state) => ({
      ...state,
      isLoading: true,
      clientSecret: null,
      error: null
    })),
    on(paymentActions.createPaymentIntentSuccess, (state, { response }) => ({
      ...state,
      clientSecret: response.clientSecret,
      isLoading: false,
    })),
    on(paymentActions.createPaymentIntentFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    }))
  ),
});

export const {
  name: paymentFeatureKey,
  reducer: paymentReducer,
  selectPaymentState,
  selectWallet,
  selectTransactions,
  selectClientSecret,
  selectIsLoading,
  selectError,
} = paymentFeature;
