import { WalletResponseDTO, TransactionResponseDTO } from "../data-access/payment.dto";
import { ApiError } from "../../../shared/models/api.error.model";

export interface PaymentState {
  wallet: WalletResponseDTO | null;
  transactions: TransactionResponseDTO[];
  clientSecret: string | null;
  isLoading: boolean;
  error: ApiError | null;
}
