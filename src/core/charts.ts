import type { PeriodFilter, Transaction, CandleTimeframe, AreaPoint, OHLCCandle } from '../types';
import { getSignedAmount, sortTransactionsChronologically } from './finance';

export const toChartUtcDaySeconds = (year: number, month: number, day: number) => Math.floor(Date.UTC(year, month, day) / 1000);
const dayStart = (ms: number) => { const d = new Date(ms); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
const label = (ms: number) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(ms).replace('.', '');

export function buildBalanceAreaSeries(transactions: Transaction[], filter: PeriodFilter, nowMs = Date.now()): AreaPoint[] {
  const sorted = sortTransactionsChronologically(transactions);
  const today = dayStart(nowMs);
  let start = today - (filter === '30D' ? 29 : 6) * 86_400_000;
  if (filter === 'ALL' && sorted.length) start = Math.min(dayStart(sorted[0].timestamp), today - 6 * 86_400_000);
  let balance = 0, index = 0;
  while (index < sorted.length && sorted[index].timestamp < start) balance += getSignedAmount(sorted[index++]);
  const points: AreaPoint[] = [];
  for (let ms = start; ms <= today;) {
    const next = new Date(ms); next.setDate(next.getDate() + 1);
    const end = next.getTime() - 1;
    while (index < sorted.length && sorted[index].timestamp <= end) balance += getSignedAmount(sorted[index++]);
    const d = new Date(ms);
    points.push({ time: toChartUtcDaySeconds(d.getFullYear(), d.getMonth(), d.getDate()), value: balance, labelDate: label(ms) });
    ms = next.getTime();
  }
  return points;
}

interface Bucket { start: number; end: number }
function bucketsFor(transactions: Transaction[], timeframe: CandleTimeframe, nowMs: number): Bucket[] {
  const sorted = sortTransactionsChronologically(transactions), now = new Date(nowMs), first = sorted[0]?.timestamp ?? nowMs;
  const out: Bucket[] = [];
  if (timeframe === '1D') {
    let cur = Math.min(dayStart(first), dayStart(nowMs) - 29 * 86_400_000);
    const last = dayStart(nowMs);
    while (cur <= last) { const d = new Date(cur); d.setDate(d.getDate() + 1); out.push({ start: cur, end: d.getTime() - 1 }); cur = d.getTime(); }
  } else if (timeframe === '1W') {
    const monday = (ms: number) => { const d = new Date(ms); const diff = d.getDay() === 0 ? -6 : 1 - d.getDay(); d.setDate(d.getDate() + diff); return dayStart(d.getTime()); };
    let cur = Math.min(monday(first), monday(nowMs) - 11 * 7 * 86_400_000);
    const last = monday(nowMs);
    while (cur <= last) { const d = new Date(cur); d.setDate(d.getDate() + 7); out.push({ start: cur, end: d.getTime() - 1 }); cur = d.getTime(); }
  } else {
    const month = (d: Date) => d.getFullYear() * 12 + d.getMonth();
    let m = Math.min(month(new Date(first)), month(now) - 11), last = month(now);
    for (; m <= last; m++) { const y = Math.floor(m / 12), mo = m % 12; out.push({ start: new Date(y, mo, 1).getTime(), end: new Date(y, mo + 1, 1).getTime() - 1 }); }
  }
  return out;
}

export function buildOHLCCandles(transactions: Transaction[], timeframe: CandleTimeframe, nowMs = Date.now()): OHLCCandle[] {
  const sorted = sortTransactionsChronologically(transactions), buckets = bucketsFor(sorted, timeframe, nowMs);
  let index = 0, balance = 0;
  while (index < sorted.length && sorted[index].timestamp < (buckets[0]?.start ?? nowMs)) balance += getSignedAmount(sorted[index++]);
  return buckets.map(bucket => {
    const open = balance; let high = open, low = open, close = open, txCount = 0;
    while (index < sorted.length && sorted[index].timestamp <= bucket.end) {
      const tx = sorted[index++];
      if (tx.timestamp < bucket.start) continue;
      balance += getSignedAmount(tx); high = Math.max(high, balance); low = Math.min(low, balance); close = balance; txCount++;
    }
    const d = new Date(bucket.start);
    return { time: toChartUtcDaySeconds(d.getFullYear(), d.getMonth(), d.getDate()), open, high, low, close, txCount };
  });
}
