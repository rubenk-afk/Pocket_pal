export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'fampay';
  balance: number;
  parentId?: string; // For sub-accounts like FamPay
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
  time: string;
}

export interface Loan {
  id: string;
  type: 'given' | 'taken';
  personName: string;
  amount: number;
  description: string;
  date: string;
  isSettled: boolean;
}

export interface Budget {
  id: string;
  month: string; // YYYY-MM format
  limit: number;
  alertShown: boolean;
}

export interface Reminder {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  recurrence: 'weekly' | 'monthly' | 'yearly' | 'custom';
  customDays?: number;
  isActive: boolean;
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Education',
  'Mobile Recharge',
  'Other'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Refund',
  'Other'
];
