import FormTrasansction from "@/components/FormTrasansction";
import { getALLLabels } from "@/hooks/labelHooks";
import { getWallet } from "@/hooks/walletHooks";
import { useEffect } from "react";
import { View } from "react-native";

export default function Create() {
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
