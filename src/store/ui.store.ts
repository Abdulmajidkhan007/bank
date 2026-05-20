import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type UIState = {
  toasts: Toast[];
  showToast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  showToast: (t) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((toast) => toast.id !== id) }));
    }, 3200);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
