import { createContext, createElement, useContext, type ReactNode } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';
import type { Account, Transaction, Loan, Reminder } from '@/types/finance';
import { insertTransaction, removeTransaction, positiveAmount, money, validDate, type FinanceState } from '@/lib/finance';

const defaultAccounts: Account[] = [
  { id: '1', name: 'Bank Account', type: 'bank', balance: 0 },
  { id: '2', name: 'FamPay', type: 'fampay', balance: 0, parentId: '1' }
];

// Keep old keys untouched so upgrading preserves existing records.
function initialState(): FinanceState {
  const read = <T,>(key: string, fallback: T[]): T[] => {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error(`Invalid saved data in ${key}.`);
    return parsed as T[];
  };
  return {
    accounts: read('finance-accounts', defaultAccounts),
    transactions: read('finance-transactions', []),
    loans: read('finance-loans', []),
    budgets: read('finance-budgets', []),
    reminders: read('finance-reminders', []),
  };
}

function useFinanceModel() {
  const [state, setState] = useLocalStorage<FinanceState>('finance-data-v1', initialState);
  const { accounts, transactions, loans, budgets, reminders } = state;
  const commit = (update: (previous: FinanceState) => FinanceState): boolean => {
    try {
      setState(update);
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save. Check browser storage and try again.');
      return false;
    }
  };
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => commit(previous =>
    insertTransaction(previous, { ...transaction, id: crypto.randomUUID() }));
  const deleteTransaction = (id: string) => commit(previous => removeTransaction(previous, id));
  const addLoan = (loan: Omit<Loan, 'id'>) => commit(previous => {
    if (!loan.personName.trim() || !validDate(loan.date)) throw new Error('Enter a name and a valid date.');
    return { ...previous, loans: [{ ...loan, personName: loan.personName.trim(), amount: positiveAmount(loan.amount), id: crypto.randomUUID() }, ...previous.loans] };
  });
  const toggleLoanSettled = (id: string) => commit(previous => ({ ...previous,
    loans: previous.loans.map(loan => loan.id === id ? { ...loan, isSettled: !loan.isSettled } : loan) }));
  const deleteLoan = (id: string) => commit(previous => ({ ...previous, loans: previous.loans.filter(loan => loan.id !== id) }));
  const setBudget = (month: string, limit: number) => commit(previous => {
    const amount = positiveAmount(limit);
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('Choose a valid month.');
    const budget = { id: previous.budgets.find(item => item.month === month)?.id ?? crypto.randomUUID(), month, limit: amount, alertShown: false };
    return { ...previous, budgets: [...previous.budgets.filter(item => item.month !== month), budget] };
  });
  const markBudgetAlertShown = (month: string) => commit(previous => ({ ...previous,
    budgets: previous.budgets.map(budget => budget.month === month ? { ...budget, alertShown: true } : budget) }));
  const addReminder = (reminder: Omit<Reminder, 'id'>) => commit(previous => {
    if (!reminder.name.trim() || !validDate(reminder.dueDate)) throw new Error('Enter a reminder name and a valid due date.');
    if (reminder.recurrence === 'custom' && (!Number.isSafeInteger(reminder.customDays) || reminder.customDays <= 0)) {
      throw new Error('Custom recurrence must be a positive whole number of days.');
    }
    return { ...previous, reminders: [{ ...reminder, name: reminder.name.trim(), amount: positiveAmount(reminder.amount), id: crypto.randomUUID() }, ...previous.reminders] };
  });
  const deleteReminder = (id: string) => commit(previous => ({ ...previous, reminders: previous.reminders.filter(reminder => reminder.id !== id) }));
  const toggleReminderActive = (id: string) => commit(previous => ({ ...previous,
    reminders: previous.reminders.map(reminder => reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder) }));
  const updateAccountBalance = (accountId: string, balance: number) => commit(previous => {
    const amount = money(balance);
    if (!previous.accounts.some(account => account.id === accountId)) throw new Error('Account not found.');
    return { ...previous, accounts: previous.accounts.map(account => account.id === accountId ? { ...account, balance: amount } : account) };
  });
  const currentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };
  const getCurrentMonthExpenses = () => money(transactions.filter(item => item.type === 'expense' && item.date.startsWith(currentMonth())).reduce((total, item) => total + item.amount, 0));
  const getCurrentBudget = () => budgets.find(item => item.month === currentMonth());
  const getDailySpending = (date: string) => money(transactions.filter(item => item.type === 'expense' && item.date === date).reduce((total, item) => total + item.amount, 0));

  return { accounts, transactions, loans, budgets, reminders, addTransaction, deleteTransaction, addLoan,
    toggleLoanSettled, deleteLoan, setBudget, markBudgetAlertShown, addReminder, deleteReminder,
    toggleReminderActive, updateAccountBalance, getCurrentMonthExpenses, getCurrentBudget, getDailySpending };
}

const FinanceContext = createContext<ReturnType<typeof useFinanceModel> | null>(null);
export function FinanceProvider({ children }: { children: ReactNode }) {
  const value = useFinanceModel();
  return createElement(FinanceContext.Provider, { value }, children);
}
export function useFinanceData() {
  const value = useContext(FinanceContext);
  if (!value) throw new Error('useFinanceData requires FinanceProvider.');
  return value;
}
