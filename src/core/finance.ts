import type { BalanceSummary, PeriodFilter, Transaction } from '../types';

export const getSignedAmount = (tx: Transaction) => tx.direction === 'in' ? tx.amount : -tx.amount;
export const sortTransactionsChronologically = (transactions: Transaction[]) => [...transactions].sort((a, b) => a.timestamp - b.timestamp || a.createdAt - b.createdAt || a.id.localeCompare(b.id));

export function getPeriodBounds(filter: PeriodFilter, nowMs = Date.now()) {
  const now = new Date(nowMs);
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1;
  const days = filter === 'TODAY' ? 0 : filter === '7D' ? 6 : filter === '30D' ? 29 : null;
  return { startMs: days === null ? 0 : startToday - days * 86_400_000, endMs: endToday };
}

export function calculateBalanceSummary(transactions: Transaction[], filter: PeriodFilter, includeCalibrationInStats: boolean, nowMs = Date.now()): BalanceSummary {
  const { startMs, endMs } = getPeriodBounds(filter, nowMs);
  let currentBalance = 0, openingBalance = 0, periodIncome = 0, periodExpense = 0, periodCalibrationNet = 0;
  for (const tx of transactions) {
    const signed = getSignedAmount(tx);
    currentBalance += signed;
    if (tx.timestamp < startMs) openingBalance += signed;
    if (tx.timestamp >= startMs && tx.timestamp <= endMs) {
      if (tx.type === 'income') periodIncome += tx.amount;
      else if (tx.type === 'expense') periodExpense += tx.amount;
      else {
        periodCalibrationNet += signed;
        if (includeCalibrationInStats) {
          if (tx.direction === 'in') periodIncome += tx.amount;
          else periodExpense += tx.amount;
        }
      }
    }
  }
  const equityChange = currentBalance - openingBalance;
  const pnl = openingBalance > 0 ? equityChange / openingBalance * 100 : currentBalance > 0 ? 100 : currentBalance < 0 ? -100 : 0;
  return { currentBalance, openingBalance, periodIncome, periodExpense, periodNet: periodIncome - periodExpense, periodPnlPercent: Number(pnl.toFixed(2)), periodCalibrationNet };
}

export function createCalibrationTransaction(actualBalance: number, currentRecordedBalance: number, nowMs = Date.now()): Transaction | null {
  if (!Number.isSafeInteger(actualBalance) || actualBalance < 0 || !Number.isSafeInteger(currentRecordedBalance)) throw new Error('Saldo harus berupa bilangan bulat Rupiah yang valid.');
  const delta = actualBalance - currentRecordedBalance;
  if (delta === 0) return null;
  return { id: `tx_${nowMs}_${Math.random().toString(36).slice(2, 8)}`, type: 'calibration', direction: delta > 0 ? 'in' : 'out', amount: Math.abs(delta), categoryId: 'cat_calibration', note: 'Kalibrasi', timestamp: nowMs, createdAt: nowMs, metadata: { previousBalance: currentRecordedBalance, actualBalance, delta } };
}
