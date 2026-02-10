import { WalletSimple } from "@/types";
import { create } from "zustand";

interface WalletStore {
  wallets: WalletSimple[];
  addWallet: (wallet: WalletSimple) => void;
  updateWallet: (wallet: WalletSimple) => void;
  deleteWallet: (id: string) => void;
  setWallet: (wallet: WalletSimple[]) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallets: [],
  addWallet: (wallet: WalletSimple) =>
    set((state) => ({ wallets: [...state.wallets, wallet] })),
  updateWallet: (updatedWallet: WalletSimple) =>
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
