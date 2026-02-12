import { Wallet } from "@/types";
import { create } from "zustand";

interface WalletStore {
  wallets: Wallet[];
  addWallet: (wallet: Wallet) => void;
  updateWallet: (wallet: Wallet) => void;
  deleteWallet: (id: string) => void;
  setWallet: (wallet: Wallet[]) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallets: [],
  addWallet: (wallet: Wallet) =>
    set((state) => ({ wallets: [...state.wallets, wallet] })),
  updateWallet: (updatedWallet: Wallet) =>
    set((state) => ({
      wallets: state.wallets.map((wallet) =>
        wallet.id === updatedWallet.id ? updatedWallet : wallet,
      ),
    })),
  deleteWallet: (id: string) =>
    set((state) => ({
      wallets: state.wallets.filter((wallet) => wallet.id !== id),
    })),
  setWallet(wallet) {
    set(() => ({ wallets: wallet }));
  },
}));
