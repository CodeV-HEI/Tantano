import { useAuth } from "@/context/AuthContext";
import { walletAPI } from "@/services/api";
import { useWalletStore } from "@/store/useWalletStore";
import { UpdateWallet, WalletSimple } from "@/types";
import { useCallback } from "react";

const mapper = (data: UpdateWallet): WalletSimple => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    type: data.type,
  };
};

export const getWallet = () => {
  const { user } = useAuth();
  const { setWallet } = useWalletStore();

  const fetchWallets = useCallback(async () => {
    try {
      const data: UpdateWallet[] = await walletAPI
        .getAll(user?.id || "")
        .then((res) => res.data.values);

      setWallet(data.map(mapper));
      console.log("Wallets fetched successfully");
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
    }
  }, [user?.id, setWallet]);

  return fetchWallets;
};
