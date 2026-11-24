export const formatIDR = (amount: number, withPrefix = true) => `${withPrefix ? 'Rp ' : ''}${Math.abs(Math.trunc(amount)).toLocaleString('id-ID')}`;
export const formatSignedIDR = (amount: number, direction: 'in'|'out') => `${direction === 'in' ? '+' : '-'}Rp ${Math.abs(Math.trunc(amount)).toLocaleString('id-ID')}`;
export const formatCompactIDR = (amount: number) => {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toLocaleString('id-ID',{maximumFractionDigits:1})} M`; 
  if (abs >= 1_000_000) return `Rp ${(amount / 1_000_000).toLocaleString('id-ID',{maximumFractionDigits:1})} jt`;
  if (abs >= 1_000) return `Rp ${(amount / 1_000).toLocaleString('id-ID',{maximumFractionDigits:0})} rb`;
  return formatIDR(amount);
};
export const formatDateTimeShort = (ms: number) => new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(ms).replace('.',':');
export const formatPnlPercent = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
export const toDateTimeLocalInputValue = (ms: number) => { const d = new Date(ms - new Date(ms).getTimezoneOffset()*60_000); return d.toISOString().slice(0,16); };
export const fromDateTimeLocalInputValue = (value: string) => new Date(value).getTime();
