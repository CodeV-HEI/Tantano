import Background from "@/components/Background";
import Loader from "@/components/Loader";
import UpdateTransaction from "@/components/UpdateTransaction";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { transactionAPI } from "@/services/api";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { Transaction } from "@/types";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function TransactionDetails() {
  const { id, walletId } = useLocalSearchParams();
  const { user } = useAuth();
  const [transactionOne, setTransactionOne] = useState<Transaction>();
  const [edited, setEdited] = useState(false);
  const { wallets, getAllLables, getWallets, getGoals, goals } =
    useTransactionStore();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // 🎨 Dynamic styles
  const cardBg = isDark ? "bg-neutral-900 border border-white/5" : "bg-white";

  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const textMuted = "text-gray-400";

  const shadow = isDark ? "" : "shadow-md";

  const wallet = wallets.find((w) => w.id === transactionOne?.walletId);
  const goal = goals.find((g) => g.id === transactionOne?.goalId);

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
    getGoals(user.id);
  }, [id, walletId, user?.id, getAllLables, getWallets, getGoals]);

  return (
    <>
      <Background />
      <View className="flex-1 px-5 pt-6">
        <View className="flex-row justify-between items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className={`p-3 rounded-full ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#fff" : "#000"}
            />
          </Pressable>

          <Pressable
            onPress={() => setEdited(!edited)}
            className={`p-3 rounded-full ${edited
              ? isDark
                ? "bg-red-900/40"
                : "bg-red-100"
              : isDark
                ? "bg-blue-900/40"
                : "bg-blue-100"
              } ${shadow}`}
          >
            {edited ? (
              <AntDesign name="close" size={20} color="#ef4444" />
            ) : (
              <FontAwesome name="edit" size={18} color="#3b82f6" />
            )}
          </Pressable>
        </View>

        {edited ? (
          transactionOne && <UpdateTransaction data={transactionOne} />
        ) : transactionOne ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Amount Card */}
            <View className={`${cardBg} rounded-3xl p-7 mb-6 ${shadow}`}>
              <View className="items-center">
                <View
                  className={`p-4 rounded-2xl mb-4 ${isDark ? "bg-blue-900/30" : "bg-blue-100"
                    }`}
                >
                  <FontAwesome name="exchange" size={28} color="#3b82f6" />
                </View>

                <Text className={`text-4xl font-extrabold ${textPrimary}`}>
                  {Number(transactionOne.amount).toLocaleString()} Ar
                </Text>

                <Text
                  className={`mt-3 px-4 py-1 rounded-full text-xs font-bold tracking-wider ${transactionOne.type === "IN"
                    ? isDark
                      ? "bg-emerald-900/30 text-emerald-400"
                      : "bg-emerald-100 text-emerald-700"
                    : isDark
                      ? "bg-rose-900/30 text-rose-400"
                      : "bg-rose-100 text-rose-700"
                    }`}
                >
                  {transactionOne.type === "IN" ? "ENTRÉE" : "SORTIE"}
                </Text>
              </View>
            </View>

            {/* Details Card */}
            <View className={`${cardBg} rounded-3xl p-6 mb-6 ${shadow}`}>
              <Text className={`text-lg font-bold mb-5 ${textPrimary}`}>
                Détails
              </Text>

              <View className="mb-4">
                <Text className={`text-xs uppercase tracking-wide ${textMuted}`}>
                  Date
                </Text>
                <Text
                  className={`text-base font-semibold mt-1 ${textSecondary}`}
                >
                  {new Date(transactionOne.date).toLocaleString()}
                </Text>
              </View>

              <View className="mb-4">
                <Text className={`text-xs uppercase tracking-wide ${textMuted}`}>
                  Description
                </Text>
                <Text
                  className={`text-base font-semibold mt-1 ${textSecondary}`}
                >
                  {transactionOne.description || "Aucune description"}
                </Text>
              </View>

              <View>
                <Text className={`text-xs uppercase tracking-wide mb-3 ${textMuted}`}>
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

            {/* Wallet Card */}
            <View className={`${cardBg} rounded-3xl p-6 mb-6 ${shadow}`}>
              <Text className={`text-lg font-bold mb-5 ${textPrimary}`}>
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
                      color={wallet?.color || "#3b82f6"}
                    />
                  )}
                </View>

                <View>
                  <Text className={`text-base font-bold ${textPrimary}`}>
                    {wallet?.name}
                  </Text>
                  <Text className={`text-xs mt-1 ${textMuted}`}>
                    {wallet?.type}
                  </Text>
                </View>
              </View>

              <Text className={`text-sm leading-relaxed ${textSecondary}`}>
                {wallet?.description}
              </Text>
            </View>

            {goal && (
              <View className={`${cardBg} rounded-3xl p-6 mt-6 ${shadow}`}>
                <Text className={`text-lg font-bold mb-5 ${textPrimary}`}>
                  Objectif
                </Text>

                <View className="flex-row items-center gap-4">
                  <View
                    className="p-3 rounded-2xl"
                    style={{ backgroundColor: goal.color + "22" }}
                  >
                    {goal.iconRef ? (
                      <Image
                        source={{ uri: goal.iconRef }}
                        width={22}
                        height={22}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="target"
                        size={22}
                        color={goal.color || "#6366f1"}
                      />
                    )}
                  </View>

                  <View className="flex-1">
                    <Text className={`text-base font-bold ${textPrimary}`}>
                      {goal.name}
                    </Text>
                    <Text className={`text-sm mt-1 ${textSecondary}`}>
                      {Number(goal.amount).toLocaleString()} Ar
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        ) : (
          <Loader />
        )}
      </View>
    </>
  );
}
