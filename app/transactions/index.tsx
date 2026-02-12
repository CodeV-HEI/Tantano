import ListTransaction from "@/components/ListTransaction";
import { useAuth } from "@/context/AuthContext";
import { transactionAPI } from "@/services/api";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Transaction } from "@/types";
import { useEffect } from "react";
import { Alert, View } from "react-native";

export default function Index() {
  const { user } = useAuth();
  const { setTransactions } = useTransactionStore();
  const accountId = user?.id;

  const fetchedTransactions = async () => {
    try {
      const response: Transaction[] = await transactionAPI
        .getAll(accountId!)
        .then((res) => res.data);
      console.log("Fetched transactions:", response);
      setTransactions(response);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Alert.alert(
        "Erreur",
        "Impossible de récupérer les transactions. Veuillez réessayer plus tard.",
      );
    }
  };

  useEffect(() => {
    fetchedTransactions();

    const intervalId = setInterval(() => {
      fetchedTransactions();
    }, 10000);

    return () => {
      clearInterval(intervalId);
      console.log("Polling arrêté");
    };
  }, [accountId]);

  return (
    <View>
      <ListTransaction />
    </View>
  );
}
