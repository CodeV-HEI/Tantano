import { transactionAPI } from "@/services/api";
import { Transaction } from "@/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, Pressable, Text, View } from "react-native";

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
    <View className="w-full border p-4 relative">
      <Text>{data.description}</Text>
      <Text>{data.amount}</Text>
      <View className="absolute top-0 right-0 flex flex-row justify-center items-center gap-2 p-2">
        <Pressable>
          <FontAwesome name="edit" size={24} color="black" />
        </Pressable>
        <Pressable onPress={() => deletePress(data.id)}>
          <MaterialIcons name="delete" size={24} color="red" />
        </Pressable>
      </View>
    </View>
  );
}
