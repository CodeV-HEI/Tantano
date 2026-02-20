import { useAuth } from "@/context/AuthContext";
import { walletAPI } from "@/services/api";
import { useWalletStore } from "@/store/useWalletStore";
import { Wallet } from "@/types";
import { useCallback } from "react";

export const getWallet = () => {
  const { user } = useAuth();
  const { setWallet } = useWalletStore();

  const fetchWallets = useCallback(async () => {
    try {
      const data: Wallet[] = await walletAPI
        .getAll(user?.id || "")
        .then((res) => res.data.values);

      setWallet(data);
      console.log("Wallets fetched successfully");
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
    }
  }, [user?.id, setWallet]);

  return fetchWallets;
};
