import { useTheme } from "@/context/ThemeContext";
import { transactionAPI } from "@/services/api";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Transaction, TransactionType } from "@/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function CardTransaction({
  data,
  onDeleteSuccess,
}: {
  data: Transaction;
  onDeleteSuccess: (id: string) => void;
}) {
  const { theme } = useTheme();
  const { wallets } = useTransactionStore();

  const wallet = wallets?.find((w) => w.id === data.walletId);

  const deletePress = async (id: string) => {
    try {
      await transactionAPI
        .delete(data.accountId, data.walletId, id)
        .then((res) => res.data);

      console.log("Transaction deleted:");

      Toast.show({
        type: "success",
        text1: "Transaction supprimée",
        text2: "La transaction a été supprimée avec succès.",
      });

      onDeleteSuccess(id);
    } catch (error) {
      console.error("Error deleting transaction:", error);

      Toast.show({
        type: "error",
        text1: "Erreur de suppression",
        text2: "Impossible de supprimer la transaction. Veuillez réessayer.",
      });
    }
  };

  const isDark = theme === "dark";
  const isOut = data.type === TransactionType.OUT;

  return (
    <TouchableOpacity
      onPress={() =>
        router.push(`./transactions/${data.walletId}/transaction/${data.id}`)
      }
      className={`
        rounded-3xl 
        p-5 
        w-full 
        border
        active:scale-[0.98]
        ${
          isDark
            ? "bg-gray-900 border-gray-800 shadow-lg"
            : "bg-white border-gray-200 shadow-sm"
        }
      `}
    >
      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-4">
        <View className="flex flex-row items-center gap-3">
          {/* Icon container */}
          <View
            className={`
              p-2 
              rounded-lg
              ${isDark ? "bg-gray-800" : "bg-blue-50"}
            `}
          >
            {wallet?.iconRef ? (
              <Image source={{ uri: wallet.iconRef }} width={20} height={20} />
            ) : (
              <MaterialCommunityIcons
                name="wallet-bifold"
                size={22}
                color={isDark ? "#60a5fa" : "#2563eb"}
              />
            )}
          </View>

          {/* Wallet info */}
          <View>
            <Text className="text-xs text-gray-400">Portefeuille</Text>
            <Text
              className={`
                text-sm 
                font-semibold 
                ${isDark ? "text-gray-100" : "text-gray-800"}
              `}
            >
              {wallet?.name || "Portefeuille Inconnu"}
            </Text>
          </View>
        </View>

        {/* Delete Button */}
        <Pressable
          onPress={() => deletePress(data.id)}
          className={`
            p-2 
            rounded-full
            ${
              isDark
                ? "bg-gray-800 active:bg-gray-700"
                : "bg-red-100 active:bg-red-200"
            }
          `}
        >
          <MaterialIcons
            name="delete-outline"
            size={20}
            color={isDark ? "#f87171" : "#ef4444"}
          />
        </Pressable>
      </View>

      {/* Description */}
      <View className="mb-4">
        <Text className="text-xs text-gray-400 mb-1">Description</Text>
        <Text
          className={`
            text-base 
            font-medium
            ${isDark ? "text-gray-100" : "text-gray-800"}
          `}
        >
          {data.description || "Sans description"}
        </Text>
      </View>

      {/* Amount */}
      <View className="flex flex-row justify-between items-center">
        <Text className="text-xs text-gray-400">Montant</Text>

        <Text
          className={`
            text-xl 
            font-bold
            ${
              isDark
                ? isOut
                  ? "text-red-400"
                  : "text-emerald-400"
                : isOut
                  ? "text-red-500"
                  : "text-emerald-600"
            }
          `}
        >
          {isOut ? "-" : "+"}
          {Number(data.amount).toLocaleString()} Ar
        </Text>
      </View>
    </TouchableOpacity>
  );
}
