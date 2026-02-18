import { transactionAPI } from "@/services/api";
import { useWalletStore } from "@/store/useWalletStore";
import { Transaction, TransactionType } from "@/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CardTransaction({
  data,
  onDeleteSuccess,
}: {
  data: Transaction;
  onDeleteSuccess: (id: string) => void;
}) {
  const { wallets } = useWalletStore();

  const wallet = wallets?.find((w) => w.id === data.walletId);

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
      className="bg-white rounded-3xl border border-gray-200 p-5 w-full relative shadow-sm active:scale-[0.98]"
    >
      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-3">
        <View className="flex flex-row items-center gap-3">
          <View className="bg-blue-50 p-2 rounded-xl">
            {wallet?.iconRef ? (
              <Image
                source={{ uri: `${wallet?.iconRef}` }}
                width={20}
                height={20}
              />
            ) : (
              <MaterialCommunityIcons
                name="wallet-bifold"
                size={22}
                color="#2563eb"
              />
            )}
          </View>

          <View>
            <Text className="text-xs text-gray-400">Wallet</Text>
            <Text className="text-sm font-semibold text-gray-800">
              {wallet?.name || "Wallet Inconnu"}
            </Text>
          </View>
        </View>

        {/* Delete Button */}
        <Pressable
          onPress={() => deletePress(data.id)}
          className="bg-red-50 p-2 rounded-full"
        >
          <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
        </Pressable>
      </View>

      {/* Description */}
      <View className="mb-3">
        <Text className="text-xs text-gray-400 mb-1">Description</Text>
        <Text className="text-base text-gray-800 font-medium">
          {data.description || "Sans description"}
        </Text>
      </View>

      {/* Amount */}
      <View className="flex flex-row justify-between items-center">
        <Text className="text-xs text-gray-400">Montant</Text>

        <Text className="text-xl font-bold text-gray-900">
          {data.type == TransactionType.OUT ? "-" : ""}
          {Number(data.amount).toLocaleString()} Ar
        </Text>
      </View>
    </TouchableOpacity>
  );
}
