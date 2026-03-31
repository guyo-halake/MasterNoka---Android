import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'seller' | 'developer';
}

interface SystemData {
  uptime: string;
  build: string;
  deployments: any[];
  updates: any[];
  notifications: any[];
}

interface Item {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface Sale {
  id: string;
  item_id: string;
  quantity: number;
  total: number;
  payment_type: 'cash' | 'plb' | 'debt';
  timestamp: string;
  customer_name?: string;
  due_date?: string;
  seller_name?: string;
}

interface Debtor {
  id: string;
  customer_name: string;
  amount: number;
  due_date: string;
  seller_id: string;
  status: 'pending' | 'paid';
}

interface AppState {
  user: User | null;
  token: string | null;
  items: Item[];
  sales: Sale[];
  debtors: Debtor[];
  systemData: SystemData | null;
  theme: 'light' | 'dark';
  
  setUser: (user: User | null, token: string | null) => void;
  setItems: (items: Item[]) => void;
  setSales: (sales: Sale[]) => void;
  setDebtors: (debtors: Debtor[]) => void;
  setSystemData: (data: SystemData) => void;
  toggleTheme: () => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      items: [],
      sales: [],
      debtors: [],
      systemData: null,
      theme: 'light',
      
      setUser: (user, token) => set({ user, token }),
      setItems: (items) => set({ items }),
      setSales: (sales) => set({ sales }),
      setDebtors: (debtors) => set({ debtors }),
      setSystemData: (systemData) => set({ systemData }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      logout: () => set({ user: null, token: null, items: [], sales: [], debtors: [], systemData: null }),
    }),
    {
      name: 'eassymoney-storage',
    }
  )
);
