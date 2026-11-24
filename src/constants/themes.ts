import type { ThemeCopy, ThemeId } from '../types';
export const THEME_COPY: Record<ThemeId, ThemeCopy> = {
  default:{appTitle:'Defisit Harian',appSubtitle:'Catatan Keuangan Pribadi',balanceLabel:'Total Saldo Saat Ini',netFlowLabel:'Net Cashflow',incomeStatLabel:'Total Pemasukan (+)',expenseStatLabel:'Total Pengeluaran (-)',btnAddIncome:'+ Pemasukan',btnAddExpense:'− Pengeluaran',btnCalibrate:'Kalibrasi Saldo',chartTitle:'Tren Saldo',historyTitle:'Riwayat Transaksi',calibrationBadge:'KALIBRASI',emptyHistoryText:'Belum ada transaksi tercatat.',tabDashboard:'Ringkasan',tabHistory:'Riwayat',tabSettings:'Pengaturan'},
  'cute-pink':{appTitle:'Dompet Imutku ✿',appSubtitle:'Tabungan & Jajan Harian',balanceLabel:'Isi Celengan Sekarang',netFlowLabel:'Sisa Uang Jajan',incomeStatLabel:'Uang Masuk (+)',expenseStatLabel:'Uang Jajan (−)',btnAddIncome:'+ Tambah tabungan',btnAddExpense:'Catat jajan',btnCalibrate:'Cocokkan celengan',chartTitle:'Tren tabunganku',historyTitle:'Catatan Jajanku',calibrationBadge:'KOREKSI ✨',emptyHistoryText:'Masih kosong nih, yuk mulai catat!',tabDashboard:'Beranda',tabHistory:'Catatan',tabSettings:'Tema & Data'},
  'crypto-larp':{appTitle:'IDR / EQUITY',appSubtitle:'Personal finance terminal · SIM',balanceLabel:'TOTAL EQUITY (IDR)',netFlowLabel:"TODAY'S PNL",incomeStatLabel:'DEPOSIT / LONG',expenseStatLabel:'WITHDRAW / SHORT',btnAddIncome:'+ BUY / DEPOSIT',btnAddExpense:'− SELL / WITHDRAW',btnCalibrate:'Rebalance',chartTitle:'IDR / EQUITY · OHLC',historyTitle:'Order & Trade History',calibrationBadge:'REBALANCE',emptyHistoryText:'No activity recorded.',tabDashboard:'Markets',tabHistory:'Orders',tabSettings:'Terminal'},
};
export const THEME_CHART_COLORS = {
 default:{line:'#2563EB',top:'rgba(37,99,235,0.28)',bottom:'rgba(37,99,235,0.015)',grid:'#F1F5F9'},
 'cute-pink':{line:'#FF69B4',top:'rgba(255,105,180,0.32)',bottom:'rgba(255,105,180,0.02)',grid:'#FCE7F3'},
 'crypto-larp':{line:'#F7A600',top:'rgba(247,166,0,0.2)',bottom:'rgba(247,166,0,0)',grid:'#1E2329'},
};
