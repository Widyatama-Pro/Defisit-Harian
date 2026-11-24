import { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/quicksand';
import '@fontsource-variable/jetbrains-mono';
import type { AppSettings, BackupPayload, Category, ThemeId, Transaction } from './types';
import { db, deleteTransaction, getCategories, getSettings, getTransactions, replaceAll, saveSettings, saveTransaction, seed } from './core/db';
import { AppShell } from './components/AppShell';
import './styles.css';

function Root(){
 const [transactions,setTransactions]=useState<Transaction[]>([]),[categories,setCategories]=useState<Category[]>([]),[settings,setSettings]=useState<AppSettings|null>(null),[error,setError]=useState('');
 const refresh=useCallback(async()=>{const [tx,cat,prefs]=await Promise.all([getTransactions(),getCategories(),getSettings()]);setTransactions(tx);setCategories(cat);setSettings(prefs);document.documentElement.dataset.theme=prefs.theme;const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',prefs.theme==='crypto-larp'?'#0B0E11':prefs.theme==='cute-pink'?'#FFF7FB':'#F8FAFC')},[]);
 useEffect(()=>{void seed().then(refresh).catch(()=>setError('Penyimpanan lokal tidak dapat dibuka. Periksa izin browser atau ruang perangkat.'));db.on('versionchange',()=>db.close());return()=>db.close()},[refresh]);
 const save=async(tx:Transaction)=>{await saveTransaction(tx);await refresh()};
 const remove=async(id:string)=>{await deleteTransaction(id);await refresh()};
 const changeTheme=async(theme:ThemeId)=>{if(!settings)return;const next={...settings,theme};await saveSettings(next);await refresh()};
 const toggleCalibration=async()=>{if(!settings)return;await saveSettings({...settings,includeCalibrationInStats:!settings.includeCalibrationInStats});await refresh()};
 const restore=async(payload:BackupPayload)=>{await replaceAll(payload);await refresh()};
 if(error)return <main className="fatal-error"><span>!</span><h1>Penyimpanan belum siap</h1><p>{error}</p><button className="btn-primary" onClick={()=>{setError('');void seed().then(refresh).catch(()=>setError('Penyimpanan lokal tidak dapat dibuka.'))}}>Coba lagi</button></main>;
 if(!settings)return <main className="loading-screen"><span className="loader"/><p>Menyiapkan ruang keuanganmu…</p></main>;
 return <AppShell transactions={transactions} categories={categories} theme={settings.theme} calibrationStats={settings.includeCalibrationInStats} onSave={save} onDelete={remove} onTheme={changeTheme} onCalibrationStats={toggleCalibration} onImport={restore} settings={settings}/>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><Root/></StrictMode>);
