import { test } from 'node:test';
import assert from 'node:assert/strict';
import { insertTransaction, removeTransaction, positiveAmount, validDate, type FinanceState } from '../src/lib/finance.ts';

const initial = (): FinanceState => ({ accounts: [
  { id: 'bank', name: 'Bank', type: 'bank', balance: 1000 },
  { id: 'wallet', name: 'Wallet', type: 'fampay', balance: 100 },
], transactions: [], loans: [], budgets: [], reminders: [] });
const expense = { id: 'expense', accountId: 'bank', type: 'expense' as const,
  amount: 125.50, category: 'Food & Dining', description: '', date: '2026-11-08', time: '14:00' };

test('expense debits only the selected account and deletion restores it', () => {
  const before = initial();
  const after = insertTransaction(before, expense);
  assert.equal(after.accounts[0].balance, 874.50);
  assert.equal(after.accounts[1].balance, 100);
  assert.equal(before.accounts[0].balance, 1000);
  assert.deepEqual(removeTransaction(after, expense.id), before);
});
test('income credits the account and deletion reverses the credit', () => {
  const before = initial();
  const after = insertTransaction(before, { ...expense, type: 'income' });
  assert.equal(after.accounts[0].balance, 1125.50);
  assert.deepEqual(removeTransaction(after, expense.id), before);
});
test('repeated deletion cannot change the balance twice', () => {
  const after = removeTransaction(insertTransaction(initial(), expense), expense.id);
  assert.strictEqual(removeTransaction(after, expense.id), after);
});
test('sequential expenses retain all records and balance changes', () => {
  const after = insertTransaction(insertTransaction(initial(), expense), { ...expense, id: 'second' });
  assert.equal(after.accounts[0].balance, 749);
  assert.equal(after.transactions.length, 2);
});
test('money rounds to paise without accumulated fractional balance drift', () => {
  const state = initial();
  state.accounts[0].balance = 0.3;
  const after = insertTransaction(state, { ...expense, amount: 0.1 });
  assert.equal(after.accounts[0].balance, 0.2);
  assert.equal(positiveAmount(1.005), 1.01);
});
test('zero, negative, non-finite and unsafe amounts are rejected', () => {
  for (const amount of [0, -1, NaN, Infinity, -Infinity, Number.MAX_VALUE, 0.001]) {
    assert.throws(() => insertTransaction(initial(), { ...expense, amount }));
  }
});
test('unknown accounts and invalid dates, times or categories cannot create records', () => {
  for (const patch of [{ accountId: 'missing' }, { date: '2026-02-30' }, { time: '25:00' }, { category: '  ' }]) {
    const state = initial();
    assert.throws(() => insertTransaction(state, { ...expense, ...patch }));
    assert.equal(state.transactions.length, 0);
    assert.equal(state.accounts[0].balance, 1000);
  }
});
test('calendar validation accepts leap days only in leap years', () => {
  assert.equal(validDate('2024-02-29'), true);
  assert.equal(validDate('2025-02-29'), false);
  assert.equal(validDate(''), false);
});
