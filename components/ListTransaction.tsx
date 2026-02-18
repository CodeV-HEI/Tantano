import { useTransactionStore } from "@/store/useTransactionStore";
import { Link } from "expo-router";
import { FlatList, Text, View } from "react-native";
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
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
      }}
      ListHeaderComponent={
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-900">Transactions</Text>
          <Text className="text-gray-400 mt-1">
            Historique de vos opérations
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View className="mb-4">
          <CardTransaction data={item} onDeleteSuccess={onDeleteSuccess} />
        </View>
      )}
      ListEmptyComponent={
        <View className="items-center mt-20">
          <Text className="text-gray-400 text-base">
            Aucune transaction trouvée
          </Text>
        </View>
      }
    />
  );
}
