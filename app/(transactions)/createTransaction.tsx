import { getALLLabels } from "@/hooks/labelHooks";
import { getWallet } from "@/hooks/walletHooks";
import { useEffect } from "react";
import { View } from "react-native";
import FormTrasansction from "../components/FormTrasansction";

export default function createTransaction() {
  const fetchWallets = getWallet();
  const fetchLabels = getALLLabels();

  useEffect(() => {
    fetchWallets();
    fetchLabels();
  }, []);

  return (
    <View>
      <FormTrasansction />
    </View>
  );
}
