import Background from "@/components/Background";
import FormTrasansction from "@/components/FormTrasansction";
import { useAuth } from "@/context/AuthContext";
import { useTransactionStore } from "@/store/useTransactionStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function create() {
  const { user } = useAuth();
  const { getWallets, getAllLables } = useTransactionStore();

  if (!user?.id) {
    Toast.show({
      type: "error",
      text1: "Utilisateur non connecté",
      text2: "Veuillez vous reconnecter.",
    });
    router.replace("/login");
    return;
  }

  useEffect(() => {
    getWallets(user.id);
    getAllLables(user.id);
  }, [user?.id]);

  return (
    <>
      <Background />
      <View>
        <FormTrasansction />
      </View>
    </>
  );
}
