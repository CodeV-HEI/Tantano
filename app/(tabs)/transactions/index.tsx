import Background from "@/components/Background";
import ListTransaction from "@/components/ListTransaction";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactionStore } from "@/stores/useTransactionStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function Index() {
  const { user } = useAuth();
  const { filter, getAllTransactions, getAllLables, getWallets, getGoals } =
    useTransactionStore();
  const accountId = user?.id;

  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Toast.show({
          type: "error",
          text1: "Session expirée",
          text2: "Veuillez vous reconnecter.",
        });
        router.replace("/login");
        return;
      }

      setIsCheckingToken(false);
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (!accountId || !user) {
      Toast.show({
        type: "error",
        text1: "Utilisateur non connecté",
        text2: "Veuillez vous reconnecter.",
      });
      router.replace("/login");
      return;
    }

    if (!isCheckingToken) {
      getAllLables(accountId);
      getWallets(accountId);
      getGoals(accountId);
      getAllTransactions(accountId, filter);
    }
  }, [accountId, filter, getAllLables, getAllTransactions, getWallets, isCheckingToken, user]);

  if (isCheckingToken) {
    return <Loader />;
  }

  return (
    <>
      <Background />
      <View className="flex-1">
        <ListTransaction />
      </View>
    </>
  );
}
