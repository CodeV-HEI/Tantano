import ListTransaction from "@/components/ListTransaction";
import { useAuth } from "@/context/AuthContext";
import { transactionAPI } from "@/services/api";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Transaction } from "@/types";
import { useEffect } from "react";
import { Alert, View } from "react-native";

export default function Index() {
  const { user } = useAuth();
  const { setTransactions, filter } = useTransactionStore();
  const accountId = user?.id;

  const fetchedTransactions = async () => {
    try {
      const response: Transaction[] = await transactionAPI
        .getAll(accountId!, {
          walletId: filter.walletId,
          startingDate: filter.startingDate,
          endingDate: filter.endingDate,
          type: filter.type,
          label: filter.label,
          minAmount: filter.minAmount,
          maxAmount: filter.maxAmount,
          sortBy: filter.sortBy,
          sort: filter.sort,
        })
        .then((res) => res.data);
      console.log("Fetched transactions:", response);
      const uniqueTransactions = Array.from(
        new Map(response.map((item) => [item.id, item])).values(),
      );
      setTransactions(uniqueTransactions);
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
    }, 60000);

    return () => {
      clearInterval(intervalId);
      console.log("Polling arrêté");
    };
  }, [accountId, filter]);

  return (
    <View className="flex-1">
      <ListTransaction />
    </View>
  );
}
