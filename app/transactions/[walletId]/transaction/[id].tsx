import UpdateTransaction from "@/components/UpdateTransaction";
import { useAuth } from "@/context/AuthContext";
import { getLabels } from "@/hooks/labelHooks";
import { getWallet } from "@/hooks/walletHooks";
import { transactionAPI } from "@/services/api";
import { useWalletStore } from "@/store/useWalletStore";
import { Transaction } from "@/types";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function TransactionDetails() {
  const { id, walletId } = useLocalSearchParams();
  const { user } = useAuth();
  const fetchWallets = getWallet();
  const fetchLabels = getLabels();
  const [transactionOne, setTransactionOne] = useState<Transaction>();
  const [edited, setEdited] = useState(false);
  const { wallets } = useWalletStore();

  const wallet = wallets.find((w) => w.id === transactionOne?.walletId);

  const fetched = async () => {
    try {
      const response: Transaction = await transactionAPI
        .getOne(user?.id || "", walletId.toString(), id.toString())
        .then((res) => res.data);
      console.log("Transaction get One success");
      setTransactionOne(response);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Erreur", "Impossible de charger");
    }
  };

  useEffect(() => {
    fetched();
    fetchWallets();
    fetchLabels();
  }, [user?.id]);

  return (
    <View className="flex-1 bg-gray-50 p-5">
      {/* Header Edit Button */}
      <View className="flex w-full items-end mb-4">
        {edited ? (
          <Pressable
            className="bg-gray-200 p-2 rounded-full"
            onPress={() => setEdited(false)}
          >
            <AntDesign name="close" size={22} color="black" />
          </Pressable>
        ) : (
          <Pressable
            className="bg-blue-500 rounded-full py-2 pl-3 pr-2"
            onPress={() => setEdited(true)}
          >
            <FontAwesome name="edit" size={20} color="white" />
          </Pressable>
        )}
      </View>

      {edited ? (
        transactionOne && <UpdateTransaction data={transactionOne} />
      ) : transactionOne ? (
        <>
          {/* ===== AMOUNT HEADER ===== */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-5">
            <View className="items-center">
              <View className="bg-blue-50 p-4 rounded-2xl mb-3">
                <FontAwesome name="exchange" size={28} color="#2563eb" />
              </View>

              <Text className="text-3xl font-bold text-gray-900">
                {Number(transactionOne.amount).toLocaleString()} Ar
              </Text>

              <Text
                className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  transactionOne.type === "IN"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {transactionOne.type}
              </Text>
            </View>
          </View>

          {/* ===== TRANSACTION INFOS ===== */}
          <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-5">
            <Text className="text-lg font-bold mb-4 text-gray-900">
              Transaction Infos
            </Text>

            {/* Date */}
            <View className="mb-3">
              <Text className="text-xs text-gray-400">Date</Text>
              <Text className="text-base font-semibold text-gray-800">
                {new Date(transactionOne.date).toLocaleString()}
              </Text>
            </View>

            {/* Description */}
            <View className="mb-3">
              <Text className="text-xs text-gray-400">Description</Text>
              <Text className="text-base font-semibold text-gray-800">
                {transactionOne.description || "Aucune description"}
              </Text>
            </View>

            {/* Labels */}
            <View>
              <Text className="text-xs text-gray-400 mb-2">Labels</Text>

              <View className="flex flex-row flex-wrap gap-2">
                {transactionOne.labels?.map((label) => (
                  <View
                    key={label.id}
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: label.color + "33" }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: label.color }}
                    >
                      {label.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* ===== WALLET CARD ===== */}
          <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold mb-4 text-gray-900">Wallet</Text>

            <View className="flex flex-row items-center gap-4 mb-4">
              <View
                className="p-3 rounded-xl"
                style={{ backgroundColor: wallet?.color + "33" }}
              >
                <MaterialCommunityIcons
                  name={"wallet"}
                  size={24}
                  color={wallet?.color || "#000"}
                />
              </View>

              <View>
                <Text className="text-base font-bold text-gray-900">
                  {wallet?.name}
                </Text>

                <Text className="text-xs text-gray-400">{wallet?.type}</Text>
              </View>
            </View>

            <Text className="text-sm text-gray-600">{wallet?.description}</Text>
          </View>
        </>
      ) : (
        <Text>Chargement...</Text>
      )}
    </View>
  );
}
