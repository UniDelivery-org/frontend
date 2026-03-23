export interface WalletResponseDTO {
  id: string;
  ownerId: string;
  balance: number;
  frozenAmount: number;
  commissionDebt: number;
}

export interface TransactionResponseDTO {
  id: string;
  walletId: string;
  amount: number;
  type: 'DEPOSIT' | 'COMMISSION_DEDUCTION' | 'WITHDRAWAL' | 'EARNING' | 'REFUND';
  description: string;
  createdAt: string;
}

export interface TransactionRequestDTO {
  walletId: string;
  amount: number;
  type: string;
  description: string;
}

export interface StripeIntentRequestDTO {
  walletId: string;
  amountInCents: number;
}

export interface StripeIntentResponseDTO {
  clientSecret: string;
}
