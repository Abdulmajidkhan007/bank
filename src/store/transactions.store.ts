import { create } from 'zustand';
import { Transaction, TxCategory } from '@/types/domain';
import { mockTransactions } from '@/services/api/mock';

type Filter = {
  query: string;
  category: TxCategory | 'all';
  direction: 'all' | 'in' | 'out';
};

type TxState = {
  items: Transaction[];
  filter: Filter;
  setQuery: (q: string) => void;
  setCategory: (c: Filter['category']) => void;
  setDirection: (d: Filter['direction']) => void;
  resetFilter: () => void;
  add: (tx: Transaction) => void;
};

export const useTxStore = create<TxState>((set) => ({
  items: mockTransactions,
  filter: { query: '', category: 'all', direction: 'all' },
  setQuery: (q) => set((s) => ({ filter: { ...s.filter, query: q } })),
  setCategory: (c) => set((s) => ({ filter: { ...s.filter, category: c } })),
  setDirection: (d) => set((s) => ({ filter: { ...s.filter, direction: d } })),
  resetFilter: () => set({ filter: { query: '', category: 'all', direction: 'all' } }),
  add: (tx) => set((s) => ({ items: [tx, ...s.items] })),
}));
