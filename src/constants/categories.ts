import type { Category } from '../types';
export const DEFAULT_CATEGORIES: Category[] = [
  {id:'cat_salary',name:'Gaji / Upah',type:'income',iconName:'Wallet',colorHex:'#10B981',sortOrder:1},
  {id:'cat_bonus',name:'Bonus & THR',type:'income',iconName:'Gift',colorHex:'#34D399',sortOrder:2},
  {id:'cat_profit',name:'Bisnis / Profit',type:'income',iconName:'TrendingUp',colorHex:'#059669',sortOrder:3},
  {id:'cat_income_other',name:'Pemasukan Lain',type:'income',iconName:'CirclePlus',colorHex:'#6EE7B7',sortOrder:4},
  {id:'cat_food',name:'Makan & Minum',type:'expense',iconName:'Utensils',colorHex:'#F97316',sortOrder:5},
  {id:'cat_transport',name:'Transportasi',type:'expense',iconName:'Car',colorHex:'#3B82F6',sortOrder:6},
  {id:'cat_shopping',name:'Belanja',type:'expense',iconName:'ShoppingBag',colorHex:'#EC4899',sortOrder:7},
  {id:'cat_bills',name:'Tagihan & Kuota',type:'expense',iconName:'Zap',colorHex:'#EAB308',sortOrder:8},
  {id:'cat_entertainment',name:'Hiburan & Hobi',type:'expense',iconName:'Gamepad2',colorHex:'#8B5CF6',sortOrder:9},
  {id:'cat_expense_other',name:'Pengeluaran Lain',type:'expense',iconName:'CircleMinus',colorHex:'#64748B',sortOrder:10},
  {id:'cat_calibration',name:'Kalibrasi',type:'system',iconName:'SlidersHorizontal',colorHex:'#F7A600',sortOrder:99},
];
export const getCategoryById = (id: string, categories = DEFAULT_CATEGORIES) => categories.find(c => c.id === id) ?? DEFAULT_CATEGORIES[10];
