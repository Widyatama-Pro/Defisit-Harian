import type { AppSettings, BackupPayload, Category, Transaction } from '../types';
import Dexie, { type Table } from 'dexie';
import { DEFAULT_CATEGORIES } from '../constants/categories';

class DefisitHarianDB extends Dexie {
  transactions!: Table<Transaction, string>;
  categories!: Table<Category, string>;
  settings!: Table<AppSettings, string>;
  constructor() {
    super('DefisitHarianDB');
    this.version(1).stores({ transactions:'id,type,direction,categoryId,timestamp,createdAt', categories:'id,type,sortOrder', settings:'id' });
  }
}
export const db = new DefisitHarianDB();
const DEFAULT_SETTINGS: AppSettings = { id:'app_settings', theme:'default', includeCalibrationInStats:false, defaultPeriodFilter:'30D', defaultCandleTimeframe:'1D', updatedAt:Date.now() };

export async function seed() {
  await db.transaction('rw', db.settings, db.categories, async () => {
    if (await db.settings.count() === 0) await db.settings.put(DEFAULT_SETTINGS);
    if (await db.categories.count() === 0) await db.categories.bulkPut(DEFAULT_CATEGORIES);
  });
}
export const getSettings = async () => (await db.settings.get('app_settings')) ?? DEFAULT_SETTINGS;
export const getTransactions = () => db.transactions.orderBy('timestamp').reverse().toArray();
export const getCategories = () => db.categories.orderBy('sortOrder').toArray();
export const saveTransaction = (tx: Transaction) => db.transactions.put(tx);
export const deleteTransaction = (id: string) => db.transactions.delete(id);
export const saveSettings = (settings: AppSettings) => db.settings.put({ ...settings, updatedAt: Date.now() });
export async function replaceAll(payload: BackupPayload) {
  await db.transaction('rw', db.transactions, db.categories, db.settings, async () => {
    await Promise.all([db.transactions.clear(), db.categories.clear(), db.settings.clear()]);
    if (payload.categories.length) await db.categories.bulkPut(payload.categories);
    if (payload.transactions.length) await db.transactions.bulkPut(payload.transactions);
    await db.settings.put({ ...payload.settings, id:'app_settings', updatedAt:Date.now() });
  });
}
