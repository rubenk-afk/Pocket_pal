import type { Account, Transaction, Loan, Budget, Reminder } from '../types/finance.ts';

export interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  loans: Loan[];
  budgets: Budget[];
  reminders: Reminder[];
}

export function money(value: number): number {
  if (!Number.isFinite(value) || !Number.isSafeInteger(Math.round(value * 100))) {
    throw new Error('Enter a valid amount within the supported range.');
  }
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function positiveAmount(value: number): number {
  const amount = money(value);
  if (amount <= 0) throw new Error('Amount must be greater than zero.');
  return amount;
}

export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function insertTransaction(state: FinanceState, transaction: Transaction): FinanceState {
  const amount = positiveAmount(transaction.amount);
  if (!state.accounts.some(account => account.id === transaction.accountId)) {
    throw new Error('Select an existing account.');
  }
  if (!['income', 'expense'].includes(transaction.type) || !transaction.category.trim() ||
      !validDate(transaction.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(transaction.time)) {
    throw new Error('Choose a category and enter a valid date and time.');
  }
  const change = transaction.type === 'income' ? amount : -amount;
  return {
    ...state,
    transactions: [{ ...transaction, amount }, ...state.transactions],
    accounts: state.accounts.map(account => account.id === transaction.accountId
      ? { ...account, balance: money(account.balance + change) } : account),
  };
}

export function removeTransaction(state: FinanceState, id: string): FinanceState {
  const transaction = state.transactions.find(item => item.id === id);
  if (!transaction) return state;
  const change = transaction.type === 'income' ? -transaction.amount : transaction.amount;
  return {
    ...state,
    transactions: state.transactions.filter(item => item.id !== id),
    accounts: state.accounts.map(account => account.id === transaction.accountId
      ? { ...account, balance: money(account.balance + change) } : account),
  };
}
