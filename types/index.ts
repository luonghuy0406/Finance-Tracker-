export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description?: string;
  date: string;
  categoryId: string;
  walletId: string;
  type: TransactionType;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface UserSettings {
  currency: Currency;
  language: string;
  theme: 'light' | 'dark';
}

export interface TimeFilter {
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  startDate?: string;
  endDate?: string;
}