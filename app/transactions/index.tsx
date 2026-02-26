import Background from "@/components/Background";
import ListTransaction from "@/components/ListTransaction";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { useTransactionStore } from "@/store/useTransactionStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function Index() {
  const { user } = useAuth();
  const { filter, getAllTransactions, getAllLables, getWallets, isloaded } =
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
      getAllTransactions(accountId, filter);

      const intervalId = setInterval(() => {
        getAllTransactions(accountId, filter);
      }, 90000);

      return () => clearInterval(intervalId);
    }
  }, [accountId, filter, isCheckingToken]);

  if (isCheckingToken || isloaded) {
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
