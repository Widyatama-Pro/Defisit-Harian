# Defisit Harian

Aplikasi pencatatan keuangan pribadi **offline-first** untuk Android. Tanpa akun, tanpa cloud, tanpa pelacakan — semua data tersimpan lokal di perangkat (IndexedDB/Dexie).

## Fitur

- **Dashboard saldo real-time** — ringkasan saldo, pemasukan, pengeluaran, net cashflow per periode (Hari ini/7H/30H/3B/1T/Semua).
- **Grafik tren** — area chart saldo harian + mode candlestick OHLC (1D/1W/1M) untuk tema Crypto Terminal.
- **Riwayat transaksi** — pencarian, filter periode, edit/hapus, grup per hari.
- **Kalibrasi saldo** — koreksi saldo tanpa memalsukan riwayat pemasukan/pengeluaran.
- **3 tema** — `default` (Standar), `cute-pink` (Cute Pink), `crypto-larp` (Crypto Terminal), via CSS variables.
- **Backup/restore** — ekspor & impor JSON lokal (divalidasi schema).

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + CSS variables (`data-theme`)
- Dexie (IndexedDB)
- Capacitor 6 (Android WebView)
- lightweight-charts, lucide-react
- Font lokal via `@fontsource-variable/*` (tidak butuh internet saat runtime)

## Menjalankan (web dev)

```bash
npm install
npm run dev
```

## Test & build

```bash
npm run test:core   # self-check assert/strict untuk logika inti
npm run build       # tsc -b && vite build -> dist/
npm run preview
```

## Build APK Android

Prereq: Node 20+, JDK 17, Android SDK (platform-tools, platforms;android-34, build-tools;34.0.0).

```bash
npm install
npm run test:core
npm run build
npx cap sync android
cd android && ./gradlew assembleRelease   # atau assembleDebug
```

Di Windows tanpa Android Studio, repo ini juga menyertakan helper lokal (gitignored):

```bash
python scripts/setup-android-sdk.py   # unduh JDK+cmdline-tools ke .toolchain/
python scripts/build-apk.py           # build + cap sync + gradle assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`.  
Signing release membaca `android/keystore.properties` (gitignored); jika tidak ada, Gradle fallback ke debug signing.

## CI / Deploy GitHub

- `.github/workflows/release-apk.yml` — build APK pada push tag `v*` / workflow_dispatch, upload artifact + attach ke GitHub Release.
- `.github/workflows/deploy-pages.yml` — build web + deploy ke GitHub Pages pada push `main`.

Aktifkan GitHub Pages: **Settings → Pages → Source: GitHub Actions**.

## Struktur (sesuai implementasi aktual)

```
src/
  core/        finance, charts, backup, db, format, self-check
  components/  AppShell, Charts, Modals, SettingsView, Icon
  constants/   categories, themes
  types/       index.ts
  main.tsx, styles.css
android/       proyek Capacitor Android
scripts/       setup-android-sdk.py, build-apk.py, gen_icons.py
```

## Privasi

Offline-first. Tidak ada telemetry, tidak ada request jaringan saat runtime (font & aset dibundle). Backup adalah file JSON yang Anda kontrol sendiri.
