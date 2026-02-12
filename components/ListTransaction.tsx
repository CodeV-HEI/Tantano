import { useTransactionStore } from "@/store/useTransactionStore";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import CardTransaction from "./CardTransaction";

export default function ListTransaction() {
  const { transactions, setTransactions } = useTransactionStore();

  const onDeleteSuccess = (id: string) => {
    setTransactions(transactions?.filter((t) => t.id !== id) || []);
  };

  if (transactions === undefined || transactions.length === 0) {
    return (
      <View className="flex justify-center items-center p-4 w-full gap-4">
        <Text className="text-2xl">Aucune transaction trouvée.</Text>
        <Link href="/transactions/create">
          <Text className="text-blue-500 underline">
            Ajouter une transaction
          </Text>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex justify-center items-center p-4 w-full gap-4">
      {transactions.map((transaction) => (
        <CardTransaction
          key={transaction.id}
          data={transaction}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </View>
  );
}
