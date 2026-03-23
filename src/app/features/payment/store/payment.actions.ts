import { createActionGroup, props } from "@ngrx/store";
import { WalletResponseDTO, TransactionResponseDTO, TransactionRequestDTO, StripeIntentRequestDTO, StripeIntentResponseDTO } from "../data-access/payment.dto";
import { ApiError } from "../../../shared/models/api.error.model";

export const paymentActions = createActionGroup({
  source: 'payment',
  events: {
    'Load Wallet': props<{ ownerId: string }>(),
    'Load Wallet Success': props<{ wallet: WalletResponseDTO }>(),
    'Load Wallet Failure': props<{ error: ApiError }>(),

    'Initialize Wallet': props<{ ownerId: string }>(),
    'Initialize Wallet Success': props<{ wallet: WalletResponseDTO }>(),
    'Initialize Wallet Failure': props<{ error: ApiError }>(),

    'Load Transactions': props<{ walletId: string }>(),
    'Load Transactions Success': props<{ transactions: TransactionResponseDTO[] }>(),
    'Load Transactions Failure': props<{ error: ApiError }>(),

    'Record Transaction': props<{ request: TransactionRequestDTO }>(),
    'Record Transaction Success': props<{ transaction: TransactionResponseDTO }>(),
    'Record Transaction Failure': props<{ error: ApiError }>(),

    'Create Payment Intent': props<{ request: StripeIntentRequestDTO }>(),
    'Create Payment Intent Success': props<{ response: StripeIntentResponseDTO }>(),
    'Create Payment Intent Failure': props<{ error: ApiError }>(),
  },
});
