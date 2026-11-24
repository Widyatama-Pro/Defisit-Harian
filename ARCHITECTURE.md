# ARCHITECTURE: Defisit Harian

## 1. Exact Folder & File Tree

Seluruh proyek menggunakan struktur file yang dikunci di bawah ini. AI Eksekutor **dilarang membuat file atau folder baru di luar daftar ini**.

```text
defisit-harian/
├── android/                                  # Di-generate otomatis oleh Capacitor CLI pada T-20
├── public/
│   └── favicon.svg
├── src/
│   ├── types/
│   │   └── index.ts                          # Seluruh kontrak TypeScript & interface global
│   ├── constants/
│   │   ├── categories.ts                     # 11 kategori built-in beserta nama ikon Lucide
│   │   └── themes.ts                         # Konfigurasi 3 tema & kamus micro-copy THEME_COPY
│   ├── db/
│   │   ├── database.ts                       # Inisialisasi Dexie.js, skema tabel, & seed awal
│   │   └── repositories.ts                   # Fungsi CRUD transaksi, settings, & query Dexie
│   ├── utils/
│   │   ├── formatters.ts                     # Formatter Rupiah, tanggal, & persentase PnL
│   │   ├── balanceEngine.ts                  # Kalkulasi running balance, summary, & kalibrasi
│   │   ├── chartTransformers.ts              # Konversi transaksi ke AreaPoint[] & OHLCCandle[]
│   │   └── backupManager.ts                  # Validasi JSON, export (Capacitor/Web), & restore
│   ├── context/
│   │   └── AppContext.tsx                    # React Context global (theme, transactions, actions)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx                    # Top bar + tombol Kalibrasi
│   │   │   └── BottomNav.tsx                 # Navigasi bawah 3 tab (Dashboard, History, Settings)
│   │   ├── dashboard/
│   │   │   ├── SummaryCards.tsx              # Kartu Total Saldo, Net/PnL, Income, Expense
│   │   │   └── QuickActionButtons.tsx        # Tombol besar (+) Pemasukan & (-) Pengeluaran
│   │   ├── charts/
│   │   │   ├── AreaBalanceChart.tsx          # Grafik Gunung-Gunung (Default & Cute Pink)
│   │   │   └── CryptoCandlestickChart.tsx    # Grafik OHLC Candlestick ala Bybit (Larper Crypto)
│   │   ├── modals/
│   │   │   ├── TransactionModal.tsx          # Bottom sheet input/edit transaksi + Custom Numpad
│   │   │   ├── CalibrationModal.tsx          # Modal input saldo asli & kalkulasi delta otomatis
│   │   │   └── RestoreConfirmModal.tsx       # Modal konfirmasi sebelum timpa database dari JSON
│   │   ├── history/
│   │   │   └── HistoryView.tsx               # Daftar riwayat transaksi + filter + edit/hapus
│   │   └── settings/
│   │       └── SettingsView.tsx              # Pemilih 3 Tema, toggle statistik kalibrasi, Backup UI
│   ├── App.tsx                               # Main shell yang menggabungkan tab & modal
│   ├── main.tsx                              # Entry point React DOM
│   └── index.css                             # Tailwind directives + CSS Variables untuk 3 tema
├── capacitor.config.ts                       # Konfigurasi Capacitor Android
├── index.html                                # HTML utama + Google Fonts (Inter, Quicksand, JetBrains Mono)
├── package.json                              # Dependencies terkunci
├── postcss.config.js                         # Konfigurasi PostCSS untuk Tailwind
├── tailwind.config.js                        # Konfigurasi Tailwind CSS
└── tsconfig.json                             # Konfigurasi TypeScript ketat
```

---

## 2. Exact TypeScript Interfaces & Dexie DB Schema

### 2.1 Kontrak TypeScript (`src/types/index.ts`)
Salin dan gunakan tipe data ini secara eksak tanpa mengubah satu huruf pun:

```typescript
export type ThemeId = 'default' | 'cute-pink' | 'crypto-larp';

export type TransactionType = 'income' | 'expense' | 'calibration';

export type CashflowDirection = 'in' | 'out';

export type PeriodFilter = 'TODAY' | '7D' | '30D' | 'ALL';

export type CandleTimeframe = '1D' | '1W' | '1M';

export type ActiveTab = 'DASHBOARD' | 'HISTORY' | 'SETTINGS';

export interface CalibrationMetadata {
  previousBalance: number;
  actualBalance: number;
  delta: number;
}

export interface Transaction {
  id: string;                        // UUID atau string unik: "tx_<timestamp>_<random>"
  type: TransactionType;             // 'income' | 'expense' | 'calibration'
  direction: CashflowDirection;      // 'in' menambah saldo (+), 'out' mengurangi saldo (-)
  amount: number;                    // Selalu integer positif > 0 (dalam Rupiah)
  categoryId: string;                // Mengacu ke Category.id (misal 'cat_food', 'cat_calibration')
  note: string;                      // Catatan transaksi; untuk kalibrasi selalu berisi "Kalibrasi"
  timestamp: number;                 // Waktu transaksi dalam Unix epoch milliseconds
  createdAt: number;                 // Waktu record dibuat dalam Unix epoch milliseconds
  metadata?: CalibrationMetadata;    // Hanya terisi jika type === 'calibration'
}

export interface Category {
  id: string;                        // misal: 'cat_food', 'cat_salary', 'cat_calibration'
  name: string;                      // Nama kategori bahasa Indonesia
  type: 'income' | 'expense' | 'system';
  iconName: string;                  // Nama ikon dari lucide-react
  colorHex: string;                  // Warna badge kategori
  sortOrder: number;
}

export interface AppSettings {
  id: 'app_settings';                // Primary key singleton di tabel settings
  theme: ThemeId;                    // 'default' | 'cute-pink' | 'crypto-larp'
  includeCalibrationInStats: boolean;// Default: false
  defaultPeriodFilter: PeriodFilter; // Default: '30D'
  defaultCandleTimeframe: CandleTimeframe; // Default: '1D'
  updatedAt: number;
}

export interface BalanceSummary {
  currentBalance: number;            // Saldo akhir saat ini dari seluruh transaksi
  openingBalance: number;            // Saldo tepat sebelum rentang periode dimulai
  periodIncome: number;              // Total pemasukan pada periode terpilih
  periodExpense: number;             // Total pengeluaran pada periode terpilih
  periodNet: number;                 // periodIncome - periodExpense
  periodPnlPercent: number;          // Persentase perubahan saldo selama periode
  periodCalibrationNet: number;      // Total net kalibrasi selama periode
}

export interface AreaPoint {
  time: number;                      // Unix timestamp dalam DETIK (UTCTimestamp lightweight-charts)
  value: number;                     // Nilai saldo pada titik waktu tersebut
  labelDate: string;                 // String tanggal terformat, misal "23 Nov"
}

export interface OHLCCandle {
  time: number;                      // Unix timestamp awal bucket dalam DETIK (UTC midnight)
  open: number;                      // Saldo awal periode candle
  high: number;                      // Saldo tertinggi sepanjang periode candle
  low: number;                       // Saldo terendah sepanjang periode candle
  close: number;                     // Saldo akhir periode candle
  txCount: number;                   // Jumlah transaksi di dalam candle tersebut
}

export interface BackupPayload {
  app: 'defisit-harian';
  version: 1;
  exportedAt: string;                // ISO 8601 timestamp
  settings: AppSettings;
  categories: Category[];
  transactions: Transaction[];
}

export interface ThemeCopy {
  appTitle: string;
  appSubtitle: string;
  balanceLabel: string;
  netFlowLabel: string;
  incomeStatLabel: string;
  expenseStatLabel: string;
  btnAddIncome: string;
  btnAddExpense: string;
  btnCalibrate: string;
  chartTitle: string;
  historyTitle: string;
  calibrationBadge: string;
  emptyHistoryText: string;
  tabDashboard: string;
  tabHistory: string;
  tabSettings: string;
}
```

### 2.2 Skema Database IndexedDB dengan Dexie (`src/db/database.ts`)
Database lokal menggunakan `Dexie` bernama `'DefisitHarianDB'` versi `1`:

```typescript
import Dexie, { type Table } from 'dexie';
import type { Transaction, Category, AppSettings } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';

export class DefisitHarianDB extends Dexie {
  transactions!: Table<Transaction, string>;
  categories!: Table<Category, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('DefisitHarianDB');
    this.version(1).stores({
      transactions: 'id, type, direction, categoryId, timestamp, createdAt',
      categories: 'id, type, sortOrder',
      settings: 'id'
    });
  }
}

export const db = new DefisitHarianDB();

export async function ensureDatabaseSeeded(): Promise<void> {
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.put({
      id: 'app_settings',
      theme: 'default',
      includeCalibrationInStats: false,
      defaultPeriodFilter: '30D',
      defaultCandleTimeframe: '1D',
      updatedAt: Date.now(),
    });
  }

  const categoryCount = await db.categories.count();
  if (categoryCount === 0) {
    await db.categories.bulkPut(DEFAULT_CATEGORIES);
  }
}
```

---

## 3. Exact Core Algorithms (Pseudocode & Reference Implementation Siap Terjemah)

### 3.1 Kalkulasi Saldo Berjalan (*Running Balance*) & Ringkasan Periode (`src/utils/balanceEngine.ts`)

```typescript
import type { Transaction, PeriodFilter, BalanceSummary } from '../types';

export function getSignedAmount(tx: Transaction): number {
  return tx.direction === 'in' ? tx.amount : -tx.amount;
}

export function sortTransactionsChronologically(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => {
    if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
    if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
    return a.id.localeCompare(b.id);
  });
}

export function getPeriodBounds(filter: PeriodFilter, nowMs: number = Date.now()): { startMs: number; endMs: number } {
  const now = new Date(nowMs);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();

  const DAY_MS = 86_400_000;
  switch (filter) {
    case 'TODAY':
      return { startMs: startOfToday, endMs: endOfToday };
    case '7D':
      return { startMs: startOfToday - 6 * DAY_MS, endMs: endOfToday };
    case '30D':
      return { startMs: startOfToday - 29 * DAY_MS, endMs: endOfToday };
    case 'ALL':
    default:
      return { startMs: 0, endMs: endOfToday };
  }
}

export function calculateBalanceSummary(
  transactions: Transaction[],
  filter: PeriodFilter,
  includeCalibrationInStats: boolean,
  nowMs: number = Date.now()
): BalanceSummary {
  const sorted = sortTransactionsChronologically(transactions);
  const { startMs, endMs } = getPeriodBounds(filter, nowMs);

  let currentBalance = 0;
  let openingBalance = 0;
  let periodIncome = 0;
  let periodExpense = 0;
  let periodCalibrationNet = 0;

  for (const tx of sorted) {
    const signed = getSignedAmount(tx);
    currentBalance += signed;

    if (tx.timestamp < startMs) {
      openingBalance += signed;
    } else if (tx.timestamp >= startMs && tx.timestamp <= endMs) {
      if (tx.type === 'income') {
        periodIncome += tx.amount;
      } else if (tx.type === 'expense') {
        periodExpense += tx.amount;
      } else if (tx.type === 'calibration') {
        periodCalibrationNet += signed;
        if (includeCalibrationInStats) {
          if (tx.direction === 'in') periodIncome += tx.amount;
          else periodExpense += tx.amount;
        }
      }
    }
  }

  const periodNet = periodIncome - periodExpense;

  let periodPnlPercent = 0;
  const equityChange = currentBalance - openingBalance;
  if (openingBalance > 0) {
    periodPnlPercent = (equityChange / openingBalance) * 100;
  } else if (openingBalance === 0 && currentBalance > 0) {
    periodPnlPercent = 100;
  } else if (openingBalance === 0 && currentBalance < 0) {
    periodPnlPercent = -100;
  }

  return {
    currentBalance,
    openingBalance,
    periodIncome,
    periodExpense,
    periodNet,
    periodPnlPercent: Number(periodPnlPercent.toFixed(2)),
    periodCalibrationNet,
  };
}
```

### 3.2 Pembuatan Transaksi Kalibrasi (`createCalibrationTransaction`)
Ditempatkan di `src/utils/balanceEngine.ts`:

```typescript
export function createCalibrationTransaction(
  actualBalance: number,
  currentRecordedBalance: number,
  nowMs: number = Date.now()
): Transaction | null {
  const cleanActual = Math.round(actualBalance);
  const cleanRecorded = Math.round(currentRecordedBalance);
  const delta = cleanActual - cleanRecorded;

  if (delta === 0) {
    return null;
  }

  return {
    id: `tx_${nowMs}_${Math.random().toString(36).substring(2, 8)}`,
    type: 'calibration',
    direction: delta > 0 ? 'in' : 'out',
    amount: Math.abs(delta),
    categoryId: 'cat_calibration',
    note: 'Kalibrasi',
    timestamp: nowMs,
    createdAt: nowMs,
    metadata: {
      previousBalance: cleanRecorded,
      actualBalance: cleanActual,
      delta,
    },
  };
}
```

### 3.3 Konversi Transaksi ke Grafik Gunung-Gunung (`buildBalanceAreaSeries`)
Ditempatkan di `src/utils/chartTransformers.ts`:

```typescript
import type { Transaction, PeriodFilter, AreaPoint } from '../types';
import { getSignedAmount, sortTransactionsChronologically } from './balanceEngine';

export function toChartUtcDaySeconds(year: number, monthZeroIndexed: number, day: number): number {
  return Math.floor(Date.UTC(year, monthZeroIndexed, day, 0, 0, 0, 0) / 1000);
}

export function buildBalanceAreaSeries(
  transactions: Transaction[],
  filter: PeriodFilter,
  nowMs: number = Date.now()
): AreaPoint[] {
  const sorted = sortTransactionsChronologically(transactions);
  const DAY_MS = 86_400_000;
  const now = new Date(nowMs);
  const todayStartMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();

  let rangeStartMs: number;
  if (filter === 'TODAY' || filter === '7D') {
    rangeStartMs = todayStartMs - 6 * DAY_MS;
  } else if (filter === '30D') {
    rangeStartMs = todayStartMs - 29 * DAY_MS;
  } else {
    if (sorted.length > 0) {
      const firstDate = new Date(sorted[0].timestamp);
      const firstDayStart = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate(), 0, 0, 0, 0).getTime();
      rangeStartMs = Math.min(firstDayStart, todayStartMs - 6 * DAY_MS);
    } else {
      rangeStartMs = todayStartMs - 6 * DAY_MS;
    }
  }

  let runningBalance = 0;
  let txIndex = 0;
  while (txIndex < sorted.length && sorted[txIndex].timestamp < rangeStartMs) {
    runningBalance += getSignedAmount(sorted[txIndex]);
    txIndex++;
  }

  const points: AreaPoint[] = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  for (let dayStart = rangeStartMs; dayStart <= todayStartMs; dayStart += DAY_MS) {
    const dayEnd = dayStart + DAY_MS - 1;
    while (txIndex < sorted.length && sorted[txIndex].timestamp <= dayEnd) {
      runningBalance += getSignedAmount(sorted[txIndex]);
      txIndex++;
    }

    const d = new Date(dayStart);
    points.push({
      time: toChartUtcDaySeconds(d.getFullYear(), d.getMonth(), d.getDate()),
      value: runningBalance,
      labelDate: `${d.getDate()} ${monthNames[d.getMonth()]}`,
    });
  }

  return points;
}
```

### 3.4 Algoritma Eksak Konversi Transaksi ke OHLC Candlestick (`buildOHLCCandles`)
Ditempatkan di `src/utils/chartTransformers.ts`.
**Aturan Pembentukan Candle (Open, High, Low, Close)**:
1. Setiap periode waktu (`1D` = 1 hari kalender, `1W` = 1 minggu dimulai Senin, `1M` = 1 bulan kalender) adalah sebuah **Bucket** `[bucketStartMs, bucketEndMs]`.
2. **`Open` (O)**: Saldo berjalan tepat saat bucket dimulai (saldo penutupan bucket sebelumnya). Sebelum ada transaksi apa pun, `Open = 0`.
3. **Iterasi Intra-Periode**:
   - Inisialisasi `high = open`, `low = open`, `close = open`.
   - Untuk setiap transaksi `tx` di dalam bucket (kronologis):
     - `runningBalance += getSignedAmount(tx)`
     - `if (runningBalance > high) high = runningBalance`
     - `if (runningBalance < low) low = runningBalance`
     - `close = runningBalance`
4. **Penanganan Periode Kosong Tanpa Transaksi**:
   - Jika `txCount === 0`, terbentuk **Flat Candle / Doji**: `O = H = L = C = saldo penutupan sebelumnya`.
5. **Minimum Visual Candles**:
   - `1D`: minimal 30 hari candle; `1W`: minimal 12 minggu candle; `1M`: minimal 12 bulan candle.

```typescript
import type { CandleTimeframe, OHLCCandle } from '../types';

interface TimeBucket {
  startMs: number;
  endMs: number;
  chartTimeSeconds: number;
}

function generateTimeBuckets(
  firstTxMs: number,
  nowMs: number,
  timeframe: CandleTimeframe
): TimeBucket[] {
  const DAY_MS = 86_400_000;
  const now = new Date(nowMs);
  const buckets: TimeBucket[] = [];

  if (timeframe === '1D') {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    const firstDate = new Date(firstTxMs);
    const firstDayStart = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate(), 0, 0, 0, 0).getTime();
    const startMs = Math.min(firstDayStart, todayStart - 29 * DAY_MS);

    for (let cur = startMs; cur <= todayStart; cur += DAY_MS) {
      const d = new Date(cur);
      buckets.push({
        startMs: cur,
        endMs: cur + DAY_MS - 1,
        chartTimeSeconds: toChartUtcDaySeconds(d.getFullYear(), d.getMonth(), d.getDate()),
      });
    }
  } else if (timeframe === '1W') {
    const getMondayStart = (ms: number): number => {
      const d = new Date(ms);
      const day = d.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday, 0, 0, 0, 0).getTime();
    };
    const currentWeekMonday = getMondayStart(nowMs);
    const firstWeekMonday = getMondayStart(firstTxMs);
    const startMonday = Math.min(firstWeekMonday, currentWeekMonday - 11 * 7 * DAY_MS);

    for (let cur = startMonday; cur <= currentWeekMonday; cur += 7 * DAY_MS) {
      const d = new Date(cur);
      buckets.push({
        startMs: cur,
        endMs: cur + 7 * DAY_MS - 1,
        chartTimeSeconds: toChartUtcDaySeconds(d.getFullYear(), d.getMonth(), d.getDate()),
      });
    }
  } else {
    const currentMonthYear = now.getFullYear();
    const currentMonthIdx = now.getMonth();
    const firstDate = new Date(firstTxMs);
    const totalCurrentMonths = currentMonthYear * 12 + currentMonthIdx;
    const totalFirstMonths = firstDate.getFullYear() * 12 + firstDate.getMonth();
    const startTotalMonths = Math.min(totalFirstMonths, totalCurrentMonths - 11);

    for (let m = startTotalMonths; m <= totalCurrentMonths; m++) {
      const year = Math.floor(m / 12);
      const month = m % 12;
      const startMs = new Date(year, month, 1, 0, 0, 0, 0).getTime();
      const endMs = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
      buckets.push({
        startMs,
        endMs,
        chartTimeSeconds: toChartUtcDaySeconds(year, month, 1),
      });
    }
  }

  return buckets;
}

export function buildOHLCCandles(
  transactions: Transaction[],
  timeframe: CandleTimeframe,
  nowMs: number = Date.now()
): OHLCCandle[] {
  const sorted = sortTransactionsChronologically(transactions);
  const firstTxMs = sorted.length > 0 ? sorted[0].timestamp : nowMs;
  const buckets = generateTimeBuckets(firstTxMs, nowMs, timeframe);

  let runningBalance = 0;
  let txIndex = 0;

  if (buckets.length > 0) {
    while (txIndex < sorted.length && sorted[txIndex].timestamp < buckets[0].startMs) {
      runningBalance += getSignedAmount(sorted[txIndex]);
      txIndex++;
    }
  }

  const candles: OHLCCandle[] = [];

  for (const bucket of buckets) {
    const open = runningBalance;
    let high = open;
    let low = open;
    let close = open;
    let txCount = 0;

    while (txIndex < sorted.length && sorted[txIndex].timestamp <= bucket.endMs) {
      const tx = sorted[txIndex];
      if (tx.timestamp >= bucket.startMs) {
        runningBalance += getSignedAmount(tx);
        if (runningBalance > high) high = runningBalance;
        if (runningBalance < low) low = runningBalance;
        close = runningBalance;
        txCount++;
      }
      txIndex++;
    }

    candles.push({
      time: bucket.chartTimeSeconds,
      open,
      high,
      low,
      close,
      txCount,
    });
  }

  return candles;
}
```

### 3.5 Validasi & Restore File Backup JSON (`src/utils/backupManager.ts`)

```typescript
import type { BackupPayload } from '../types';
import { db } from '../db/database';

const VALID_THEMES = new Set(['default', 'cute-pink', 'crypto-larp']);
const VALID_TX_TYPES = new Set(['income', 'expense', 'calibration']);
const VALID_DIRECTIONS = new Set(['in', 'out']);

export function parseAndValidateBackupJson(jsonString: string): BackupPayload {
  let raw: unknown;
  try {
    raw = JSON.parse(jsonString);
  } catch {
    throw new Error('File bukan format JSON yang valid.');
  }

  if (!raw || typeof raw !== 'object') {
    throw new Error('Struktur root JSON tidak valid.');
  }

  const obj = raw as Record<string, unknown>;
  if (obj.app !== 'defisit-harian' || obj.version !== 1) {
    throw new Error('File JSON ini bukan file backup Defisit Harian versi 1.');
  }

  if (!Array.isArray(obj.transactions)) {
    throw new Error('Data transaksi (transactions) tidak ditemukan di dalam file backup.');
  }

  if (!Array.isArray(obj.categories)) {
    throw new Error('Data kategori (categories) tidak ditemukan di dalam file backup.');
  }

  if (!obj.settings || typeof obj.settings !== 'object') {
    throw new Error('Data pengaturan (settings) tidak ditemukan di dalam file backup.');
  }

  for (const item of obj.transactions) {
    if (!item || typeof item !== 'object') {
      throw new Error('Terdapat entri transaksi yang rusak.');
    }
    const tx = item as Record<string, unknown>;
    if (
      typeof tx.id !== 'string' ||
      !VALID_TX_TYPES.has(tx.type as string) ||
      !VALID_DIRECTIONS.has(tx.direction as string) ||
      typeof tx.amount !== 'number' ||
      tx.amount <= 0 ||
      !Number.isFinite(tx.amount) ||
      typeof tx.categoryId !== 'string' ||
      typeof tx.timestamp !== 'number'
    ) {
      throw new Error(`Transaksi dengan ID "${String(tx.id ?? 'unknown')}" memiliki format yang tidak valid.`);
    }
  }

  const settingsObj = obj.settings as Record<string, unknown>;
  if (!VALID_THEMES.has(settingsObj.theme as string)) {
    throw new Error('Tema pada file backup tidak dikenali.');
  }

  return obj as unknown as BackupPayload;
}

export async function executeDatabaseRestore(payload: BackupPayload): Promise<void> {
  await db.transaction('rw', [db.transactions, db.categories, db.settings], async () => {
    await db.transactions.clear();
    await db.categories.clear();
    await db.settings.clear();

    if (payload.categories.length > 0) {
      await db.categories.bulkPut(payload.categories);
    }
    if (payload.transactions.length > 0) {
      await db.transactions.bulkPut(payload.transactions);
    }
    await db.settings.put({
      ...payload.settings,
      id: 'app_settings',
      updatedAt: Date.now(),
    });
  });
}
```

---

## 4. Coding Rules untuk AI Eksekutor (Wajib Dipatuhi)

1. **Larangan Ubah Kontrak Data**: Dilarang menambah, menghapus, atau mengganti nama properti pada interface di `src/types/index.ts`. Seluruh komponen wajib mengimpor tipe dari `src/types/index.ts`.
2. **Pemisahan Mutlak UI vs Logika Kalkulasi**:
   - Komponen `.tsx` di dalam `src/components/` **dilarang** menghitung running balance, selisih kalibrasi, atau melakukan loop pembuatan candle OHLC secara langsung.
   - Semua perhitungan matematis wajib memanggil fungsi murni (*pure functions*) dari `src/utils/balanceEngine.ts` dan `src/utils/chartTransformers.ts`.
3. **Kepatuhan Token Tema CSS Variable**:
   - Dilarang menulis warna statis Tailwind seperti `bg-white`, `bg-slate-900`, atau `text-black` pada container utama, kartu, dan teks.
   - Wajib menggunakan CSS Variables tema: `bg-[var(--bg-primary)]`, `bg-[var(--bg-surface)]`, `bg-[var(--bg-elevated)]`, `text-[var(--text-primary)]`, `text-[var(--text-secondary)]`, `border-[var(--border-color)]`.
4. **Kepatuhan Micro-Copy Tema**:
   - Semua judul layar, label tombol utama (`+` / `-` / `Kalibrasi`), label kartu ringkasan, dan badge kalibrasi wajib diambil dari objek `copy` (`THEME_COPY[settings.theme]`) yang disediakan oleh `useAppContext()`.
5. **Lifecycle Chart (`lightweight-charts`)**:
   - Setiap komponen yang memanggil `createChart(containerRef.current, ...)` **wajib** memiliki fungsi cleanup `return () => chart.remove()` di dalam `useEffect` dan memasang `ResizeObserver` agar tidak terjadi kebocoran memori atau duplikasi canvas saat user berpindah tab atau mengganti tema.
6. **Batas File per Task**:
   - Saat mengerjakan satu Task (`T-XX`), AI Eksekutor hanya boleh membuat atau memodifikasi file yang tercantum pada bagian **Target Files** di task tersebut.
