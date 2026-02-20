import { Transaction, TransactionFilter } from "@/types";
import { create } from "zustand";

interface TransactionStore {
  transactions: Transaction[];
  filter: TransactionFilter;
  setTransactions: (transactions: Transaction[]) => void;
  setFilter: (filter: Partial<TransactionFilter>) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  filter: {
    walletId: undefined,
    startingDate: undefined,
    endingDate: undefined,
    type: undefined,
    label: [],
    maxAmount: undefined,
    minAmount: undefined,
    sortBy: "date",
    sort: "asc",
  },
  setFilter: (newFilter: Partial<TransactionFilter>) =>
    set((state) => ({
      filter: {
        ...state.filter,
        ...newFilter,
      },
    })),
}));
