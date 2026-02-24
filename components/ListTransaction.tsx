import { useTransactionStore } from "@/store/useTransactionStore";
import { FlatList, Text, View } from "react-native";
import CardTransaction from "./CardTransaction";

export default function ListTransaction() {
  const { transactions, setTransactions } = useTransactionStore();

  const onDeleteSuccess = (id: string) => {
    setTransactions(transactions?.filter((t) => t.id !== id) || []);
  };

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
      }}
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
