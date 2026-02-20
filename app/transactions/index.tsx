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
          endingDate: filter.endingDate,
          label: filter.label,
          maxAmount: filter.maxAmount,
          minAmount: filter.minAmount,
          sort: filter.sort,
          sortBy: filter.sortBy,
          startingDate: filter.startingDate,
          type: filter.type,
          walletId: filter.walletId,
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

  console.log(filter);

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
    <View>
      <ListTransaction />
    </View>
  );
}
