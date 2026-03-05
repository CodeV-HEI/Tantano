import Background from "@/components/Background";
import FormTrasansction from "@/components/FormTrasansction";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function Create() {
  const { user } = useAuth();
  const { getWallets, getAllLables } = useTransactionStore();

  useEffect(() => {
    if (user?.id) {
      getWallets(user.id);
      getAllLables(user.id);
    }
  }, [getAllLables, getWallets, user?.id]);

  if (!user?.id) {
    Toast.show({
      type: "error",
      text1: "Utilisateur non connecté",
      text2: "Veuillez vous reconnecter.",
    });
    router.replace("/login");
    return null;
  }

  return (
    <>
      <Background />
      <View>
        <FormTrasansction />
      </View>
    </>
  );
}