export type ThemeId = 'default' | 'cute-pink' | 'crypto-larp';
export type TransactionType = 'income' | 'expense' | 'calibration';
export type CashflowDirection = 'in' | 'out';
export type PeriodFilter = 'TODAY' | '7D' | '30D' | 'ALL';
export type CandleTimeframe = '1D' | '1W' | '1M';
export type ActiveTab = 'DASHBOARD' | 'HISTORY' | 'SETTINGS';
export interface CalibrationMetadata { previousBalance: number; actualBalance: number; delta: number }
export interface Transaction { id: string; type: TransactionType; direction: CashflowDirection; amount: number; categoryId: string; note: string; timestamp: number; createdAt: number; metadata?: CalibrationMetadata }
export interface Category { id: string; name: string; type: 'income' | 'expense' | 'system'; iconName: string; colorHex: string; sortOrder: number }
export interface AppSettings { id: 'app_settings'; theme: ThemeId; includeCalibrationInStats: boolean; defaultPeriodFilter: PeriodFilter; defaultCandleTimeframe: CandleTimeframe; updatedAt: number }
export interface BalanceSummary { currentBalance: number; openingBalance: number; periodIncome: number; periodExpense: number; periodNet: number; periodPnlPercent: number; periodCalibrationNet: number }
export interface AreaPoint { time: number; value: number; labelDate: string }
export interface OHLCCandle { time: number; open: number; high: number; low: number; close: number; txCount: number }
export interface BackupPayload { app: 'defisit-harian'; version: 1; exportedAt: string; settings: AppSettings; categories: Category[]; transactions: Transaction[] }
export interface ThemeCopy { appTitle: string; appSubtitle: string; balanceLabel: string; netFlowLabel: string; incomeStatLabel: string; expenseStatLabel: string; btnAddIncome: string; btnAddExpense: string; btnCalibrate: string; chartTitle: string; historyTitle: string; calibrationBadge: string; emptyHistoryText: string; tabDashboard: string; tabHistory: string; tabSettings: string }
