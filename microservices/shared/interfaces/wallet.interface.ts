export interface WalletBalanceDto {
  userId: string;
  money: number;
  coins: number;
}

export interface WalletTransactionDto {
  userId: string;
  amount: number;
  currency: 'money' | 'coins';
  type: 'credit' | 'debit';
  source: string;
  meta?: Record<string, any>;
}

export interface WalletTransactionResponseDto {
  success: boolean;
  transactionId?: string;
  newBalance?: number;
  error?: string;
}