import { transactionAPI } from "@/services/api";
import { Transaction } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function CardTransaction({
  data,
  onDeleteSuccess,
}: {
  data: Transaction;
  onDeleteSuccess: (id: string) => void;
}) {
  const deletePress = async (id: string) => {
    try {
      const response = await transactionAPI
        .delete(data.accountId, data.walletId, id)
        .then((res) => res.data);
      console.log("Transaction deleted:", response);
      Alert.alert("Succès", "La transaction a été supprimée avec succès.");
      onDeleteSuccess(id);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert(
        "Erreur",
        "Impossible de supprimer la transaction. Veuillez réessayer plus tard.",
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.push(`./transactions/${data.walletId}/transaction/${data.id}`)
      }
      className="w-full border p-4 relative"
    >
      <Text>{data.description}</Text>
      <Text>{data.amount}</Text>
      <View className="absolute top-0 right-0 flex flex-row justify-center items-center gap-2 p-2">
        <Pressable onPress={() => deletePress(data.id)}>
          <MaterialIcons name="delete" size={24} color="red" />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
}
