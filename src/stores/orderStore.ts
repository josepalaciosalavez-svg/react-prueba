import { create } from 'zustand';
import type { Order } from '@/types/order';

export interface OrderState {
  selectedOrder: Order | null;
  searchFilter: string;
  setSelectedOrder: (order: Order | null) => void;
  setSearchFilter: (filter: string) => void;
  clearSelectedOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  selectedOrder: null,
  searchFilter: '',
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setSearchFilter: (filter) => set({ searchFilter: filter }),
  clearSelectedOrder: () => set({ selectedOrder: null }),
}));

export default useOrderStore;
