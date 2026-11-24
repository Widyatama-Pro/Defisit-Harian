# TASKS: Super-Detailed Atomic Task List (Defisit Harian)

Seluruh pengembangan dipecah menjadi **20 Task Atomic (`T-01` s/d `T-20`)** dalam 8 Fase berurutan. Setiap task hanya menyentuh **1 hingga 3 file**.

---

## FASE 1: Project Setup & Theme Foundation

### `[T-01] Inisialisasi Proyek Vite React TypeScript & Konfigurasi Dependencies`
- **Dependencies**: Tidak ada (Task pertama).
- **Target Files**:
  1. `package.json`
  2. `tsconfig.json`
  3. `capacitor.config.ts`
- **Context Needed**: Tidak ada (inisialisasi awal).
- **Step-by-Step Implementation**:
  1. Buat `package.json` dengan nama `"defisit-harian"`, `"private": true`, `"type": "module"`, dan daftar dependencies eksak berikut:
     - `dependencies`: `"react": "^18.3.1"`, `"react-dom": "^18.3.1"`, `"dexie": "^4.0.8"`, `"lightweight-charts": "^4.2.0"`, `"lucide-react": "^0.454.0"`, `"@capacitor/core": "^6.1.2"`, `"@capacitor/android": "^6.1.2"`, `"@capacitor/filesystem": "^6.0.1"`, `"@capacitor/share": "^6.0.1"`.
     - `devDependencies`: `"@capacitor/cli": "^6.1.2"`, `"@types/react": "^18.3.12"`, `"@types/react-dom": "^18.3.1"`, `"@vitejs/plugin-react": "^4.3.3"`, `"autoprefixer": "^10.4.20"`, `"postcss": "^8.4.47"`, `"tailwindcss": "^3.4.14"`, `"typescript": "^5.6.3"`, `"vite": "^5.4.10"`.
     - `scripts`: `"dev": "vite"`, `"build": "tsc -b && vite build"`, `"preview": "vite preview"`.
  2. Buat `tsconfig.json` dengan `"target": "ES2020"`, `"module": "ESNext"`, `"moduleResolution": "bundler"`, `"jsx": "react-jsx"`, `"strict": true`, `"skipLibCheck": true`.
  3. Buat `capacitor.config.ts` dengan `appId: 'com.defisitharian.app'`, `appName: 'Defisit Harian'`, `webDir: 'dist'`, dan `server: { androidScheme: 'https' }`.
  4. Jalankan `npm install` untuk menginstal seluruh paket.
- **Guardrails (Larangan)**:
  - Dilarang menambahkan library UI eksternal seperti Material UI, Chakra UI, Ant Design, atau Redux.
  - Dilarang menambahkan `react-router-dom`.
- **Definition of Done (Verification)**:
  - Menjalankan `npm install` selesai dengan exit code `0` dan folder `node_modules` terbentuk berisi `dexie`, `lightweight-charts`, dan `lucide-react`.

---

### `[T-02] Konfigurasi Tailwind CSS, Font Google & CSS Variables 3 Tema`
- **Dependencies**: `T-01`
- **Target Files**:
  1. `index.html`
  2. `tailwind.config.js`
  3. `src/index.css`
- **Context Needed**: `package.json`, `PRD.md` Bagian 4.1.
- **Step-by-Step Implementation**:
  1. Pada `index.html`, set `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />`, tambahkan Google Fonts untuk `Inter:wght@400;500;600;700`, `Quicksand:wght@500;600;700`, dan `JetBrains+Mono:wght@400;500;600;700`, serta `<div id="root"></div>` dan `<script type="module" src="/src/main.tsx"></script>`.
  2. Pada `tailwind.config.js`, set `content: ['./index.html', './src/**/*.{ts,tsx}']`, dan tambahkan utility font family `sans: ['var(--font-sans)']`, `mono: ['var(--font-mono)']`.
  3. Pada `src/index.css`, tulis `@tailwind base; @tailwind components; @tailwind utilities;` diikuti deklarasi CSS Variables untuk:
     - `:root, [data-theme="default"]` -> sesuai kolom Tema 1 pada `PRD.md` Bagian 4.1.
     - `[data-theme="cute-pink"]` -> sesuai kolom Tema 2 pada `PRD.md` Bagian 4.1.
     - `[data-theme="crypto-larp"]` -> sesuai kolom Tema 3 pada `PRD.md` Bagian 4.1.
  4. Tambahkan rule CSS global pada `body`: `background-color: var(--bg-primary); color: var(--text-primary); font-family: var(--font-sans); user-select: none; -webkit-tap-highlight-color: transparent;`.
- **Guardrails (Larangan)**:
  - Dilarang mengubah kode hex warna dari spesifikasi tabel `PRD.md` Bagian 4.1.
- **Definition of Done (Verification)**:
  - Semua variabel CSS terdefinisi lengkap untuk ketiga selector `[data-theme]`.

---

## FASE 2: Data Contracts, Constants & Local Database Layer

### `[T-03] Definisi Kontrak TypeScript, Kategori Built-in & Kamus 3 Tema`
- **Dependencies**: `T-02`
- **Target Files**:
  1. `src/types/index.ts`
  2. `src/constants/categories.ts`
  3. `src/constants/themes.ts`
- **Context Needed**: `ARCHITECTURE.md` Bagian 2.1 dan `PRD.md` Bagian 4.
- **Step-by-Step Implementation**:
  1. Buat `src/types/index.ts` dan tulis seluruh tipe & interface persis seperti pada `ARCHITECTURE.md` Bagian 2.1.
  2. Buat `src/constants/categories.ts` yang mengekspor `DEFAULT_CATEGORIES: Category[]` berisi 11 kategori eksak:
     - Income: `cat_salary` (Gaji / Upah, `Wallet`, `#10B981`), `cat_bonus` (Bonus & THR, `Gift`, `#34D399`), `cat_profit` (Bisnis / Profit, `TrendingUp`, `#059669`), `cat_income_other` (Pemasukan Lain, `PlusCircle`, `#6EE7B7`).
     - Expense: `cat_food` (Makan & Minum, `Utensils`, `#F97316`), `cat_transport` (Transportasi, `Car`, `#3B82F6`), `cat_shopping` (Belanja, `ShoppingBag`, `#EC4899`), `cat_bills` (Tagihan & Kuota, `Zap`, `#EAB308`), `cat_entertainment` (Hiburan & Hobi, `Gamepad2`, `#8B5CF6`), `cat_expense_other` (Pengeluaran Lain, `MinusCircle`, `#64748B`).
     - System: `cat_calibration` (Kalibrasi, `SlidersHorizontal`, `#F7A600`, `sortOrder: 99`).
     - Ekspor helper `getCategoryById(id: string, categories?: Category[]): Category`.
  3. Buat `src/constants/themes.ts` yang mengekspor `THEME_COPY: Record<ThemeId, ThemeCopy>` sesuai `PRD.md` Bagian 4.2, serta `THEME_CHART_COLORS`.
- **Guardrails (Larangan)**:
  - Dilarang mengimpor komponen React atau database Dexie di dalam ketiga file ini.
- **Definition of Done (Verification)**:
  - `npx tsc --noEmit` berjalan tanpa error pada ketiga file tersebut.

---

### `[T-04] Implementasi Database IndexedDB (Dexie.js) & Repository CRUD`
- **Dependencies**: `T-03`
- **Target Files**:
  1. `src/db/database.ts`
  2. `src/db/repositories.ts`
- **Context Needed**: `src/types/index.ts`, `src/constants/categories.ts`, `ARCHITECTURE.md` Bagian 2.2.
- **Step-by-Step Implementation**:
  1. Buat `src/db/database.ts` dengan class `DefisitHarianDB extends Dexie`, instance `db`, dan fungsi `ensureDatabaseSeeded()` sesuai `ARCHITECTURE.md` Bagian 2.2.
  2. Buat `src/db/repositories.ts` dengan fungsi async:
     - `getAllTransactions(): Promise<Transaction[]>` (diurutkan `timestamp` descending).
     - `getAllCategories(): Promise<Category[]>` (diurutkan `sortOrder` ascending).
     - `getAppSettings(): Promise<AppSettings>`
     - `saveTransaction(tx: Transaction): Promise<void>`
     - `deleteTransaction(id: string): Promise<void>`
     - `updateAppSettings(partial: Partial<Omit<AppSettings, 'id'>>): Promise<AppSettings>`
- **Guardrails (Larangan)**:
  - Dilarang meletakkan state UI React di dalam file database.
- **Definition of Done (Verification)**:
  - `npx tsc --noEmit` lulus tanpa error.

---

## FASE 3: Core Financial & Chart Transformation Engine

### `[T-05] Implementasi Formatter Rupiah, Tanggal & Persentase PnL`
- **Dependencies**: `T-03`
- **Target Files**:
  1. `src/utils/formatters.ts`
- **Context Needed**: `src/types/index.ts`.
- **Step-by-Step Implementation**:
  1. Buat `src/utils/formatters.ts` dan implementasikan fungsi-fungsi murni:
     - `formatIDR(amount: number, withPrefix?: boolean): string`
     - `formatSignedIDR(amount: number, direction: 'in' | 'out'): string`
     - `formatCompactIDR(amount: number): string`
     - `formatDateTimeShort(timestampMs: number): string`
     - `formatPnlPercent(percent: number): string`
     - `toDateTimeLocalInputValue(timestampMs: number): string` & `fromDateTimeLocalInputValue(val: string): number`
- **Guardrails (Larangan)**:
  - Jangan gunakan `Intl.NumberFormat` yang menghasilkan karakter non-breaking space (`\u00A0`) tanpa menormalisasinya menjadi spasi biasa `' '`.
- **Definition of Done (Verification)**:
  - `formatIDR(25000)` menghasilkan `"Rp 25.000"`, `formatSignedIDR(150000, 'out')` menghasilkan `"-Rp 150.000"`, dan `formatPnlPercent(5.5)` menghasilkan `"+5.50%"`.

---

### `[T-06] Implementasi Balance Engine & Generator Transaksi Kalibrasi`
- **Dependencies**: `T-03`, `T-05`
- **Target Files**:
  1. `src/utils/balanceEngine.ts`
- **Context Needed**: `src/types/index.ts`, `ARCHITECTURE.md` Bagian 3.1 & 3.2.
- **Step-by-Step Implementation**:
  1. Buat `src/utils/balanceEngine.ts` dan implementasikan fungsi-fungsi eksak dari `ARCHITECTURE.md` Bagian 3.1 dan 3.2:
     - `getSignedAmount(tx: Transaction): number`
     - `sortTransactionsChronologically(transactions: Transaction[]): Transaction[]`
     - `getPeriodBounds(filter: PeriodFilter, nowMs?: number): { startMs: number; endMs: number }`
     - `calculateBalanceSummary(transactions: Transaction[], filter: PeriodFilter, includeCalibrationInStats: boolean, nowMs?: number): BalanceSummary`
     - `createCalibrationTransaction(actualBalance: number, currentRecordedBalance: number, nowMs?: number): Transaction | null`
- **Guardrails (Larangan)**:
  - Pastikan transaksi dengan `type === 'calibration'` selalu dihitung pada `currentBalance` dan `openingBalance`, namun hanya masuk ke `periodIncome` / `periodExpense` apabila `includeCalibrationInStats === true`.
- **Definition of Done (Verification)**:
  - Jika ada 1 transaksi `income` Rp 500.000 lalu `createCalibrationTransaction(350000, 500000)` dipanggil, `calculateBalanceSummary(..., '30D', false)` menghasilkan `currentBalance === 350000`, `periodIncome === 500000`, dan `periodExpense === 0`.

---

### `[T-07] Implementasi Transformer Grafik Gunung-Gunung & OHLC Candlestick`
- **Dependencies**: `T-06`
- **Target Files**:
  1. `src/utils/chartTransformers.ts`
- **Context Needed**: `src/types/index.ts`, `src/utils/balanceEngine.ts`, `ARCHITECTURE.md` Bagian 3.3 & 3.4.
- **Step-by-Step Implementation**:
  1. Buat `src/utils/chartTransformers.ts`.
  2. Implementasikan `toChartUtcDaySeconds`, `buildBalanceAreaSeries`, dan `buildOHLCCandles` sesuai `ARCHITECTURE.md` Bagian 3.3 & 3.4.
- **Guardrails (Larangan)**:
  - `time` pada setiap `AreaPoint` dan `OHLCCandle` wajib dalam satuan **detik (seconds)**, dan array output wajib terurut `time` ascending secara ketat tanpa duplikat.
- **Definition of Done (Verification)**:
  - Jika `transactions = []`, `buildBalanceAreaSeries([], '7D')` mengembalikan 7 titik bernilai `0`, dan `buildOHLCCandles([], '1D')` mengembalikan 30 candle dengan `open: 0, high: 0, low: 0, close: 0`.

---

## FASE 4: Global State & App Shell Layout

### `[T-08] Implementasi Global AppContext & Sinkronisasi Tema DOM`
- **Dependencies**: `T-04`, `T-06`
- **Target Files**:
  1. `src/context/AppContext.tsx`
- **Context Needed**: `src/types/index.ts`, `src/constants/themes.ts`, `src/db/database.ts`, `src/db/repositories.ts`, `src/utils/balanceEngine.ts`.
- **Step-by-Step Implementation**:
  1. Buat `src/context/AppContext.tsx` berisi `AppProvider` dan `useAppContext()`.
  2. Kelola state `isLoading`, `transactions`, `categories`, `settings`, `activeTab`, `periodFilter`, `candleTimeframe`, `txModalState`, `isCalibrationModalOpen`.
  3. Sinkronkan `document.documentElement.setAttribute('data-theme', settings.theme)` via `useEffect`.
  4. Sediakan `copy` (`THEME_COPY[settings.theme]`) dan `summary` (`calculateBalanceSummary(...)`) via `useMemo`.
  5. Sediakan actions CRUD (`addOrUpdateTransaction`, `removeTransaction`, `applyBalanceCalibration`, `setTheme`, `setIncludeCalibrationInStats`, `refreshAllData`).
- **Guardrails (Larangan)**:
  - Setiap operasi mutasi DB wajib memanggil `await refreshAllData()`.
- **Definition of Done (Verification)**:
  - `npx tsc --noEmit` lulus tanpa error.

---

### `[T-09] Implementasi Header Bar & Bottom Navigation Bar`
- **Dependencies**: `T-08`
- **Target Files**:
  1. `src/components/layout/Header.tsx`
  2. `src/components/layout/BottomNav.tsx`
- **Context Needed**: `src/context/AppContext.tsx`, `src/types/index.ts`.
- **Step-by-Step Implementation**:
  1. Buat `Header.tsx`: menampilkan `copy.appTitle`, `copy.appSubtitle`, badge `PERP` jika tema `crypto-larp`, dan tombol Kalibrasi (`openCalibrationModal`) berlabel `copy.btnCalibrate`.
  2. Buat `BottomNav.tsx`: menampilkan 3 tab (`DASHBOARD`, `HISTORY`, `SETTINGS`) menggunakan ikon `lucide-react` dan label dari `copy.*`.
- **Guardrails (Larangan)**:
  - Dilarang menulis string judul atau label tab secara hardcode; wajib gunakan `copy.*`.
- **Definition of Done (Verification)**:
  - Kedua komponen dapat di-import tanpa error TypeScript.

---

## FASE 5: Dashboard, Transaction Numpad Modal & Calibration Modal

### `[T-10] Implementasi Kartu Ringkasan Saldo & Tombol Aksi Cepat (+ / -)`
- **Dependencies**: `T-05`, `T-08`
- **Target Files**:
  1. `src/components/dashboard/SummaryCards.tsx`
  2. `src/components/dashboard/QuickActionButtons.tsx`
- **Context Needed**: `src/context/AppContext.tsx`, `src/utils/formatters.ts`.
- **Step-by-Step Implementation**:
  1. Buat `SummaryCards.tsx`: baris filter periode (`TODAY`, `7D`, `30D`, `ALL`), kartu utama saldo (`formatIDR(summary.currentBalance)`), sub-baris Net Cashflow/PnL + persentase PnL, serta 2 kartu statistik pemasukan & pengeluaran.
  2. Buat `QuickActionButtons.tsx`: tombol `+` (`openAddTransactionModal('income')`) dan tombol `-` (`openAddTransactionModal('expense')`) menggunakan label `copy.btnAddIncome` & `copy.btnAddExpense`.
- **Guardrails (Larangan)**:
  - Jangan melakukan perhitungan ulang saldo di dalam `SummaryCards.tsx`.
- **Definition of Done (Verification)**:
  - `npx tsc --noEmit` lulus dan angka nominal memakai `font-mono tabular-nums`.

---

### `[T-11] Implementasi Modal Input/Edit Transaksi dengan Custom Numpad`
- **Dependencies**: `T-05`, `T-08`
- **Target Files**:
  1. `src/components/modals/TransactionModal.tsx`
- **Context Needed**: `src/context/AppContext.tsx`, `src/constants/categories.ts`, `src/utils/formatters.ts`.
- **Step-by-Step Implementation**:
  1. Buat `TransactionModal.tsx` yang tampil saat `txModalState.isOpen === true`.
  2. Sediakan toggle tipe (`income` / `expense`), display nominal terformat ribuan, grid pemilih kategori sesuai tipe, input catatan (maks 100 char), input `datetime-local`, dan Custom Built-in Numpad (`1-9`, `000`, `0`, `⌫`).
  3. Untuk mode edit transaksi `calibration`: kunci tipe & nominal, hanya izinkan edit `note` atau hapus transaksi.
- **Guardrails (Larangan)**:
  - Jangan gunakan `<input type="number">` untuk input nominal utama.
- **Definition of Done (Verification)**:
  - Menekan `2`, `5`, `000` menghasilkan `Rp 25.000` dan tombol `Simpan` menyimpan transaksi ke IndexedDB.

---

### `[T-12] Implementasi Modal Kalibrasi Saldo (Balance Calibration)`
- **Dependencies**: `T-06`, `T-08`
- **Target Files**:
  1. `src/components/modals/CalibrationModal.tsx`
- **Context Needed**: `src/context/AppContext.tsx`, `src/utils/formatters.ts`.
- **Step-by-Step Implementation**:
  1. Buat `CalibrationModal.tsx` yang tampil saat `isCalibrationModalOpen === true`.
  2. Tampilkan `Saldo Tercatat Saat Ini` (`summary.currentBalance`), input `Saldo Asli Sekarang` dengan Custom Numpad, dan live preview `Delta`.
  3. Tombol `"Terapkan Kalibrasi"` (`disabled` jika `delta === 0`) memanggil `await applyBalanceCalibration(actualValue)`.
- **Guardrails (Larangan)**:
  - Jangan membuat transaksi baru apabila `delta === 0`.
- **Definition of Done (Verification)**:
  - Saat `delta !== 0`, menekan `"Terapkan Kalibrasi"` membuat transaksi `type: 'calibration'`, `note: 'Kalibrasi'`.

---

## FASE 6: Chart Components (Grafik Gunung-Gunung & Bybit Candlestick)

### `[T-13] Implementasi Komponen Grafik Gunung-Gunung (AreaBalanceChart.tsx)`
- **Dependencies**: `T-07`, `T-08`
- **Target Files**:
  1. `src/components/charts/AreaBalanceChart.tsx`
- **Context Needed**: `src/utils/chartTransformers.ts`, `src/constants/themes.ts`, `src/context/AppContext.tsx`, `src/utils/formatters.ts`.
- **Step-by-Step Implementation**:
  1. Buat `AreaBalanceChart.tsx` menggunakan `createChart` dan `addAreaSeries({ lineType: LineType.Curved, ... })` dari `lightweight-charts`.
  2. Ambil data dari `buildBalanceAreaSeries(transactions, periodFilter)` dan palet warna dari `THEME_CHART_COLORS[settings.theme]`.
  3. Pasang `ResizeObserver` dan cleanup `chart.remove()`.
- **Guardrails (Larangan)**:
  - Dilarang meninggalkan instance `chart` tanpa `chart.remove()` pada cleanup `useEffect`.
- **Definition of Done (Verification)**:
  - Pada tema `default` dan `cute-pink`, grafik gunung-gunung muncul dengan kurva halus dan gradien warna tema.

---

### `[T-14] Implementasi Komponen Candlestick Chart Ala Bybit (CryptoCandlestickChart.tsx)`
- **Dependencies**: `T-07`, `T-08`
- **Target Files**:
  1. `src/components/charts/CryptoCandlestickChart.tsx`
- **Context Needed**: `src/utils/chartTransformers.ts`, `src/constants/themes.ts`, `src/context/AppContext.tsx`, `src/utils/formatters.ts`.
- **Step-by-Step Implementation**:
  1. Buat `CryptoCandlestickChart.tsx` menggunakan `createChart` dan `addCandlestickSeries` dari `lightweight-charts` dengan warna `#00C076` (up) dan `#F6465D` (down).
  2. Tambahkan header trading Bybit: pemilih timeframe `1D / 1W / 1M`, info `HIGH / LOW`, serta Live OHLC Crosshair Legend (`O`, `H`, `L`, `C`, `Tx`) via `chart.subscribeCrosshairMove`.
  3. Pasang `ResizeObserver` dan cleanup `chart.remove()`.
- **Guardrails (Larangan)**:
  - Jangan mematikan `handleScroll` atau `handleScale` pada `createChart`.
- **Definition of Done (Verification)**:
  - Saat tema `crypto-larp` aktif, chart merender candlestick interaktif dengan zoom, pan, dan pergantian timeframe `1D / 1W / 1M`.

---

## FASE 7: History, Settings, Backup/Restore & Main Assembly

### `[T-15] Implementasi Halaman History Transaksi, Filter & Edit/Hapus`
- **Dependencies**: `T-05`, `T-08`, `T-11`
- **Target Files**:
  1. `src/components/history/HistoryView.tsx`
- **Context Needed**: `src/context/AppContext.tsx`, `src/constants/categories.ts`, `src/utils/formatters.ts`.
- **Step-by-Step Implementation**:
  1. Buat `HistoryView.tsx` dengan prop opsional `limit?: number`.
  2. Jika `!limit`, tampilkan filter tipe (`ALL`, `income`, `expense`, `calibration`) dan search input.
  3. Render tiap transaksi dengan ikon kategori, badge `copy.calibrationBadge` jika `type === 'calibration'`, nominal berwarna `+/-`, serta tombol Edit & Hapus.
- **Guardrails (Larangan)**:
  - Tampilkan `copy.emptyHistoryText` bila hasil filter kosong.
- **Definition of Done (Verification)**:
  - Daftar transaksi tampil urut terbaru, badge kalibrasi tampil, dan edit/hapus berfungsi.

---

### `[T-16] Implementasi Engine Backup & Restore JSON (Web & Capacitor Android)`
- **Dependencies**: `T-04`
- **Target Files**:
  1. `src/utils/backupManager.ts`
  2. `src/components/modals/RestoreConfirmModal.tsx`
- **Context Needed**: `src/types/index.ts`, `src/db/database.ts`, `src/db/repositories.ts`, `ARCHITECTURE.md` Bagian 3.5.
- **Step-by-Step Implementation**:
  1. Buat `backupManager.ts` berisi `parseAndValidateBackupJson`, `executeDatabaseRestore`, `createBackupPayload`, dan `exportBackupToFile` (mendukung `@capacitor/filesystem` + `@capacitor/share` di Android serta Blob download di Web).
  2. Buat `RestoreConfirmModal.tsx` untuk menampilkan ringkasan backup & meminta konfirmasi sebelum menimpa database.
- **Guardrails (Larangan)**:
  - Dilarang mengeksekusi `executeDatabaseRestore` sebelum validasi JSON lolos dan user menekan konfirmasi.
- **Definition of Done (Verification)**:
  - File JSON yang tidak valid ditolak dengan pesan error jelas.

---

### `[T-17] Implementasi Halaman Pengaturan 3 Tema, Toggle Kalibrasi & Panel Backup`
- **Dependencies**: `T-08`, `T-16`
- **Target Files**:
  1. `src/components/settings/SettingsView.tsx`
- **Context Needed**: `src/context/AppContext.tsx`, `src/utils/backupManager.ts`, `src/components/modals/RestoreConfirmModal.tsx`.
- **Step-by-Step Implementation**:
  1. Buat `SettingsView.tsx` dengan 3 bagian:
     - 3 Kartu Pemilih Tema (`default`, `cute-pink`, `crypto-larp`).
     - Toggle switch `settings.includeCalibrationInStats`.
     - Panel Backup & Restore (`Export Backup (.json)` & `Import / Restore (.json)`).
- **Guardrails (Larangan)**:
  - Reset `e.target.value = ''` pada `<input type="file" />` setelah file dipilih.
- **Definition of Done (Verification)**:
  - Klik kartu tema langsung mengubah tema seluruh UI tanpa reload.

---

### `[T-18] Perakitan Main App Shell (App.tsx & main.tsx)`
- **Dependencies**: `T-09`, `T-10`, `T-11`, `T-12`, `T-13`, `T-14`, `T-15`, `T-17`
- **Target Files**:
  1. `src/App.tsx`
  2. `src/main.tsx`
- **Context Needed**: Seluruh komponen di `src/components/` dan `src/context/AppContext.tsx`.
- **Step-by-Step Implementation**:
  1. Rakit `App.tsx` dengan `<AppProvider>`, `<Header />`, konten tab aktif (`DASHBOARD`, `HISTORY`, `SETTINGS`), `<BottomNav />`, `<TransactionModal />`, dan `<CalibrationModal />`.
  2. Pada `DASHBOARD`, render `<CryptoCandlestickChart />` jika `settings.theme === 'crypto-larp'`, atau `<AreaBalanceChart />` jika tidak.
  3. Render `<App />` di `src/main.tsx`.
- **Guardrails (Larangan)**:
  - Jangan merender `AreaBalanceChart` dan `CryptoCandlestickChart` secara bersamaan.
- **Definition of Done (Verification)**:
  - `npm run build` selesai tanpa error TypeScript maupun Vite bundler.

---

## FASE 8: Unit Verification, Capacitor Android Integration & QA

### `[T-19] Verifikasi Algoritma Finansial, Kalibrasi & OHLC Candlestick`
- **Dependencies**: `T-18`
- **Target Files**:
  1. `src/utils/balanceEngine.ts`
  2. `src/utils/chartTransformers.ts`
- **Context Needed**: `src/utils/balanceEngine.ts`, `src/utils/chartTransformers.ts`.
- **Step-by-Step Implementation**:
  1. Verifikasi 4 skenario kritis:
     - Urutan transaksi intra-hari menghasilkan `O`, `H`, `L`, `C` yang tepat.
     - Bearish wick di bawah close menghasilkan `low` yang akurat.
     - Hari kosong tanpa transaksi menghasilkan flat candle (`O = H = L = C`).
     - Kalibrasi saldo menghasilkan `delta` yang tepat dan tidak mengotori statistik pemasukan/pengeluaran default.
- **Guardrails (Larangan)**:
  - Dilarang meninggalkan `console.log` debugging di kode produksi.
- **Definition of Done (Verification)**:
  - Keempat skenario tervalidasi dan `npm run build` sukses dengan 0 error.

---

### `[T-20] Sinkronisasi Capacitor Android & Konfigurasi Build APK`
- **Dependencies**: `T-19`
- **Target Files**:
  1. `capacitor.config.ts`
  2. `package.json`
- **Context Needed**: `capacitor.config.ts`, `package.json`.
- **Step-by-Step Implementation**:
  1. Tambahkan script `"android:init"`, `"android:sync"`, dan `"android:open"` di `package.json`.
  2. Jalankan `npm run build`, `npx cap add android` (jika belum ada), dan `npx cap sync android`.
- **Guardrails (Larangan)**:
  - Jangan menghapus folder `dist/` sebelum menjalankan `npx cap sync android`.
- **Definition of Done (Verification)**:
  - Folder `android/` terbentuk dan `npx cap sync android` sukses tanpa error.
