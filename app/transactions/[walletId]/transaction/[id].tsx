import Background from "@/components/Background";
import Loader from "@/components/Loader";
import UpdateTransaction from "@/components/UpdateTransaction";
import { useAuth } from "@/context/AuthContext";
import { transactionAPI } from "@/services/api";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Transaction } from "@/types";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function TransactionDetails() {
  const { id, walletId } = useLocalSearchParams();
  const { user } = useAuth();
  const [transactionOne, setTransactionOne] = useState<Transaction>();
  const [edited, setEdited] = useState(false);
  const { wallets, getAllLables, getWallets } = useTransactionStore();

  const wallet = wallets.find((w) => w.id === transactionOne?.walletId);

  useEffect(() => {
    if (!id || !walletId) {
      Toast.show({
        type: "error",
        text1: "Paramètres manquants",
        text2: "ID de transaction ou ID de portefeuille manquant.",
      });
      router.replace("/transactions");
      return;
    }

    if (!user?.id) {
      Toast.show({
        type: "error",
        text1: "Utilisateur non connecté",
        text2: "Veuillez vous reconnecter.",
      });
      router.replace("/login");
      return;
    }

    const fetched = async () => {
      try {
        const response = await transactionAPI.getOne(
          user.id,
          walletId.toString(),
          id.toString(),
        );
        setTransactionOne(response.data);
        Toast.show({
          type: "success",
          text1: "Transaction chargée",
          text2: "Détails de la transaction chargés avec succès.",
        });
      } catch (error) {
        console.error("Error loading transaction:", error);
        Toast.show({
          type: "error",
          text1: "Erreur de chargement",
          text2: "Impossible de charger la transaction.",
        });
      }
    };

    fetched();
    getAllLables(user.id);
    getWallets(user.id);
  }, [id, walletId, user?.id]);

  return (
    <>
      <Background />
      <View className="flex-1 bg-gray-100 px-5 pt-6">
        {/* ===== HEADER ACTION ===== */}
        <View className="w-full items-end mb-6">
          <Pressable
            onPress={() => setEdited(!edited)}
            className={`p-3 rounded-full shadow-sm ${
              edited ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            {edited ? (
              <AntDesign name="close" size={20} color="#dc2626" />
            ) : (
              <FontAwesome name="edit" size={18} color="#2563eb" />
            )}
          </Pressable>
        </View>

        {edited ? (
          transactionOne && <UpdateTransaction data={transactionOne} />
        ) : transactionOne ? (
          <>
            {/* ===== AMOUNT CARD ===== */}
            <View className="bg-white rounded-3xl p-7 mb-6 shadow-md">
              <View className="items-center">
                <View className="bg-blue-100 p-4 rounded-2xl mb-4">
                  <FontAwesome name="exchange" size={28} color="#2563eb" />
                </View>

                <Text className="text-4xl font-extrabold text-gray-900">
                  {Number(transactionOne.amount).toLocaleString()} Ar
                </Text>

                <Text
                  className={`mt-3 px-4 py-1 rounded-full text-xs font-bold tracking-wider ${
                    transactionOne.type === "IN"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {transactionOne.type === "IN" ? "ENTRÉE" : "SORTIE"}
                </Text>
              </View>
            </View>

            {/* ===== DETAILS CARD ===== */}
            <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
              <Text className="text-lg font-bold text-gray-900 mb-5">
                Détails
              </Text>

              {/* Date */}
              <View className="mb-4">
                <Text className="text-xs uppercase tracking-wide text-gray-400">
                  Date
                </Text>
                <Text className="text-base font-semibold text-gray-800 mt-1">
                  {new Date(transactionOne.date).toLocaleString()}
                </Text>
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="text-xs uppercase tracking-wide text-gray-400">
                  Description
                </Text>
                <Text className="text-base font-semibold text-gray-800 mt-1">
                  {transactionOne.description || "Aucune description"}
                </Text>
              </View>

              {/* Labels */}
              <View>
                <Text className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                  Labels
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {transactionOne.labels?.map((label) => (
                    <View
                      key={label.id}
                      className="px-4 py-1 rounded-full"
                      style={{ backgroundColor: label.color + "22" }}
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
            <View className="bg-white rounded-3xl p-6 shadow-sm">
              <Text className="text-lg font-bold text-gray-900 mb-5">
                Portefeuille
              </Text>

              <View className="flex-row items-center gap-4 mb-4">
                <View
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: wallet?.color + "22" }}
                >
                  {wallet?.iconRef ? (
                    <Image
                      source={{ uri: wallet.iconRef }}
                      width={22}
                      height={22}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="wallet-bifold"
                      size={22}
                      color={wallet?.color || "#2563eb"}
                    />
                  )}
                </View>

                <View>
                  <Text className="text-base font-bold text-gray-900">
                    {wallet?.name}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {wallet?.type}
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-gray-600 leading-relaxed">
                {wallet?.description}
              </Text>
            </View>
          </>
        ) : (
          <Loader />
        )}
      </View>
    </>
  );
}
