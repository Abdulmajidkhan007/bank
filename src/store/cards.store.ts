import { create } from 'zustand';
import { Card } from '@/types/domain';
import { mockCards } from '@/services/api/mock';

type CardsState = {
  cards: Card[];
  selectedId: string;
  setSelected: (id: string) => void;
  toggleFreeze: (id: string) => void;
  setPrimary: (id: string) => void;
  totalBalanceUZS: () => number;
};

const FX = { UZS: 1, USD: 12_650, EUR: 13_780, RUB: 135 } as const;

export const useCardsStore = create<CardsState>((set, get) => ({
  cards: mockCards,
  selectedId: mockCards[0]?.id ?? '',
  setSelected: (selectedId) => set({ selectedId }),
  toggleFreeze: (id) =>
    set((s) => ({
      cards: s.cards.map((c) => (c.id === id ? { ...c, frozen: !c.frozen } : c)),
    })),
  setPrimary: (id) =>
    set((s) => ({
      cards: s.cards.map((c) => ({ ...c, primary: c.id === id })),
    })),
  totalBalanceUZS: () =>
    get().cards.reduce((sum, c) => sum + c.balance * FX[c.currency], 0),
}));
