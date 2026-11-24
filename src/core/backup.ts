import type { BackupPayload, Transaction } from '../types';

const themes = new Set(['default', 'cute-pink', 'crypto-larp']);
export function parseAndValidateBackupJson(text: string): BackupPayload {
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error('File bukan format JSON yang valid.'); }
  if (!value || typeof value !== 'object') throw new Error('Struktur backup tidak valid.');
  const obj = value as Record<string, unknown>;
  if (obj.app !== 'defisit-harian' || obj.version !== 1 || !Array.isArray(obj.transactions) || !Array.isArray(obj.categories) || !obj.settings || typeof obj.settings !== 'object') throw new Error('File ini bukan backup Defisit Harian versi 1.');
  const settings = obj.settings as Record<string, unknown>;
  if (!themes.has(String(settings.theme)) || settings.id !== 'app_settings' || typeof settings.includeCalibrationInStats !== 'boolean') throw new Error('Pengaturan backup tidak valid.');
  for (const raw of obj.transactions) {
    if (!raw || typeof raw !== 'object') throw new Error('Terdapat transaksi yang rusak.');
    const tx = raw as Record<string, unknown>;
    if (typeof tx.id !== 'string' || !['income','expense','calibration'].includes(String(tx.type)) || !['in','out'].includes(String(tx.direction)) || !Number.isSafeInteger(tx.amount) || Number(tx.amount) <= 0 || typeof tx.categoryId !== 'string' || typeof tx.note !== 'string' || !Number.isFinite(tx.timestamp) || !Number.isFinite(tx.createdAt)) throw new Error(`Transaksi ${String(tx.id ?? 'tanpa ID')} tidak valid.`);
  }
  for (const raw of obj.categories) {
    if (!raw || typeof raw !== 'object') throw new Error('Terdapat kategori yang rusak.');
    const cat = raw as Record<string, unknown>;
    if (typeof cat.id !== 'string' || typeof cat.name !== 'string' || typeof cat.iconName !== 'string') throw new Error('Kategori backup tidak valid.');
  }
  return obj as unknown as BackupPayload;
}
export function makeBackupPayload(settings: BackupPayload['settings'], categories: BackupPayload['categories'], transactions: Transaction[]): BackupPayload {
  return { app: 'defisit-harian', version: 1, exportedAt: new Date().toISOString(), settings, categories, transactions };
}
