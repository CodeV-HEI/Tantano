import FormTrasansction from "@/components/FormTrasansction";
import { getLabels } from "@/hooks/labelHooks";
import { getWallet } from "@/hooks/walletHooks";
import { useEffect } from "react";
import { View } from "react-native";

export default function create() {
  const fetchWallets = getWallet();
  const fetchLabels = getLabels();

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
