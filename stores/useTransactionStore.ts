import { labelAPI, transactionAPI, walletAPI } from "@/services/api";
import {
  Label,
  Transaction,
  TransactionFilter,
  TransactionType,
  Wallet,
} from "@/types";
import Toast from "react-native-toast-message";
import { create } from "zustand";

interface TransactionStore {
  transactions: Transaction[];
  isloaded: boolean;
  filter: TransactionFilter;
  setTransactions: (transactions: Transaction[]) => void;
  setFilter: (filter: Partial<TransactionFilter>) => void;
  getAllTransactions: (
    accountId: string,
    params?: {
      walletId?: string;
      startingDate?: string;
      endingDate?: string;
      type?: TransactionType;
      label?: string[];
      minAmount?: number;
      maxAmount?: number;
      sortBy?: "date" | "amount";
      sort?: "asc" | "desc";
    },
  ) => Promise<void>;
  transactionOne: Transaction | undefined;
  getOneTransaction: (
    accountId: string,
    walletId: string,
    transactionId: string,
  ) => Promise<void>;
  wallets: Wallet[];
  setWallet: (wallet: Wallet[]) => void;
  getWallets: (accountId: string) => Promise<void>;
  labels: Label[];
  setLabels: (labels: Label[]) => void;
  getAllLables: (accountId: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  isloaded: false,
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
  getAllTransactions: async (accountId: string, params?: any) => {
    try {
      set({ isloaded: true });
      const response: Transaction[] = await transactionAPI
        .getAll(accountId!, {
          walletId: params.walletId,
          startingDate: params.startingDate,
          endingDate: params.endingDate,
          type: params.type,
          label: params.label,
          minAmount: params.minAmount,
          maxAmount: params.maxAmount,
          sortBy: params.sortBy,
          sort: params.sort,
        })
        .then((res) => res.data);
      console.log("Fetched transactions successfully:");
      const uniqueTransactions = Array.from(
        new Map(response.map((item) => [item.id, item])).values(),
      );
      set({ transactions: uniqueTransactions });
      Toast.show({
        type: "success",
        text1: "Transactions chargées",
        text2: "Les transactions ont été chargées avec succès.",
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Toast.show({
        type: "error",
        text1: "Erreur de chargement",
        text2: "Impossible de charger les transactions. Veuillez réessayer.",
      });
    } finally {
      set({ isloaded: false });
    }
  },
  transactionOne: undefined,
  getOneTransaction: async (
    accountId: string,
    walletId: string,
    transactionId: string,
  ) => {
    try {
      const response: Transaction = await transactionAPI
        .getOne(accountId, walletId, transactionId)
        .then((res) => res.data);
      console.log("Transaction get One success");
      set({ transactionOne: response });
      Toast.show({
        type: "success",
        text1: "Transaction chargée",
        text2: "La transaction a été chargée avec succès.",
      });
    } catch (error) {
      console.error("Error getting transaction:", error);
      Toast.show({
        type: "error",
        text1: "Erreur de chargement",
        text2: "Impossible de charger la transaction. Veuillez réessayer.",
      });
    }
  },
  wallets: [],
  setWallet(wallet) {
    set(() => ({ wallets: wallet }));
  },
  getWallets: async (accountId: string) => {
    try {
      const data: Wallet[] = await walletAPI
        .getAll(accountId)
        .then((res) => res.data.values);

      set({ wallets: data });
      console.log("Wallets fetched successfully");
      Toast.show({
        type: "success",
        text1: "Portefeuilles chargés",
        text2: "Les portefeuilles ont été chargés avec succès.",
      });
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
      Toast.show({
        type: "error",
        text1: "Erreur de chargement",
        text2:
          "Impossible de récupérer les portefeuilles. Veuillez réessayer plus tard.",
      });
    }
  },
  labels: [],
  setLabels(labels) {
    set(() => ({ labels }));
  },
  getAllLables: async (accountId: string) => {
    try {
      const data = await labelAPI
        .getAll(accountId)
        .then((res) => res.data.values);
      set({ labels: data });
      console.log("Labels fetched successfully");
      Toast.show({
        type: "success",
        text1: "Étiquettes chargées",
        text2: "Les étiquettes ont été chargées avec succès.",
      });
    } catch (error) {
      console.error("Failed to fetch labels:", error);
      Toast.show({
        type: "error",
        text1: "Erreur de chargement",
        text2:
          "Impossible de récupérer les étiquettes. Veuillez réessayer plus tard.",
      });
    }
  },
}));
