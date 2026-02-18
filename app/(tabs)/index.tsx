import Background3D from "@/components/DashboardBackground";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { labelAPI, transactionAPI, walletAPI } from "@/services/api";
import { Label, Transaction, Wallet, WalletType } from "@/types/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  Layout,
  SlideInRight,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function DashboardScreen() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle(theme === "dark" ? "light-content" : "dark-content");
  }, [theme]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Récupérer les portefeuilles
      const walletsRes = await walletAPI.getAll(user.id);
      const walletsData = walletsRes.data.values;
      setWallets(walletsData);

      // Récupérer les labels
      const labelsRes = await labelAPI.getAll(user.id);
      const labelsData = labelsRes.data.values;
      setLabels(labelsData);

      // Récupérer les transactions pour tous les portefeuilles
      let allTransactions: Transaction[] = [];
      for (const wallet of walletsData) {
        try {
          const transactionsRes = await transactionAPI.getAll(user.id);
          allTransactions = [...allTransactions, ...transactionsRes.data];
        } catch (error) {
          console.error(
            `Failed to fetch transactions for wallet ${wallet.id}:`,
            error,
          );
        }
      }

      // Trier les transactions par date (plus récentes en premier)
      allTransactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setTransactions(allTransactions);

      // Calculer le solde total (somme des montants des portefeuilles)
      const balance = walletsData.reduce(
        (acc: any, wallet: Wallet) => acc + wallet.amount,
        0,
      );
      setTotalBalance(balance);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      Toast.show({
        type: "error",
        text1: "Erreur de chargement",
        text2: "Impossible de charger les données",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const QuickAction = ({
    icon,
    title,
    color,
    onPress,
  }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity className="items-center" onPress={onPress}>
      <View
        className={`w-16 h-16 rounded-2xl ${color} items-center justify-center mb-2 ${theme === "dark" ? "shadow-lg shadow-cyan-500/50" : "shadow-lg shadow-cyan-400/30"}`}
      >
        <MaterialIcons name={icon} size={28} color="white" />
      </View>
      <Text
        className={`text-sm ${theme === "dark" ? "text-cyan-300" : "text-cyan-600"} font-medium tracking-wide ${theme === "dark" ? "neon-text" : "neon-text-light"}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const getWalletTypeColor = (type: WalletType) => {
    switch (type) {
      case WalletType.CASH:
        return {
          bg:
            theme === "dark"
              ? "bg-yellow-500/20 border border-yellow-500/30"
              : "bg-yellow-100/80 border border-yellow-300",
          text: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
        };
      case WalletType.MOBILE_MONEY:
        return {
          bg:
            theme === "dark"
              ? "bg-green-500/20 border border-green-500/30"
              : "bg-green-100/80 border border-green-300",
          text: theme === "dark" ? "text-green-400" : "text-green-600",
        };
      case WalletType.BANK:
        return {
          bg:
            theme === "dark"
              ? "bg-blue-500/20 border border-blue-500/30"
              : "bg-blue-100/80 border border-blue-300",
          text: theme === "dark" ? "text-blue-400" : "text-blue-600",
        };
      case WalletType.DEBT:
        return {
          bg:
            theme === "dark"
              ? "bg-red-500/20 border border-red-500/30"
              : "bg-red-100/80 border border-red-300",
          text: theme === "dark" ? "text-red-400" : "text-red-600",
        };
      default:
        return {
          bg:
            theme === "dark"
              ? "bg-gray-500/20 border border-gray-500/30"
              : "bg-gray-100/80 border border-gray-300",
          text: theme === "dark" ? "text-gray-400" : "text-gray-600",
        };
    }
  };

  if (!user) {
    return (
      <View className="flex-1 bg-white dark:bg-black items-center justify-center">
        <Text className="text-gray-900 dark:text-white text-lg">
          Chargement...
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Background 3D */}
      <Background3D />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme === "dark" ? "#06b6d4" : "#0891b2"}
            colors={[theme === "dark" ? "#06b6d4" : "#0891b2"]}
          />
        }
      >
        <View className="px-4 pt-8">
          <Animated.View entering={FadeInUp.duration(600)}>
            <Text
              className={`text-2xl font-bold text-transparent bg-clip-text ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-purple-500" : "bg-gradient-to-r from-cyan-300 to-purple-300"} ${theme === "dark" ? "neon-text" : "neon-text-light"}`}
            >
              Bonjour, {user?.username}
            </Text>
            <Text
              className={`${theme === "dark" ? "text-cyan-300/70" : "text-cyan-600/70"} mt-1 tracking-wide`}
            >
              Gérez vos finances en toute simplicité
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(200)}
            layout={Layout.springify()}
            className={`${theme === "dark" ? "bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border-cyan-500/30 shadow-cyan-500/20" : "bg-gradient-to-r from-cyan-400/10 to-purple-400/10 border-cyan-300/30 shadow-cyan-400/10"} rounded-2xl p-6 mt-6 border shadow-lg`}
          >
            <Text
              className={`${theme === "dark" ? "text-cyan-300" : "text-cyan-600"} text-lg font-medium tracking-wide ${theme === "dark" ? "neon-text" : "neon-text-light"}`}
            >
              SOLDE TOTAL
            </Text>
            <Text
              className={`${theme === "dark" ? "text-white" : "text-cyan-800"} text-4xl font-bold mt-2 ${theme === "dark" ? "neon-text" : ""}`}
            >
              {totalBalance.toLocaleString("fr-FR")} Ar
            </Text>
            <Text
              className={`${theme === "dark" ? "text-cyan-300/60" : "text-cyan-600/60"} mt-2 tracking-wide`}
            >
              {transactions.length} transactions • {wallets.length}{" "}
              portefeuilles
            </Text>
          </Animated.View>

          <Animated.View
            entering={SlideInRight.delay(300)}
            className="flex-row justify-between mt-8"
          >
            <QuickAction
              icon="add"
              title="TRANSACTION"
              color="bg-gradient-to-br from-cyan-500 to-cyan-700"
              onPress={() => router.push("/transactions")}
            />
            <QuickAction
              icon="account-balance-wallet"
              title="PORTEFEUILLE"
              color="bg-gradient-to-br from-purple-500 to-purple-700"
              onPress={() => router.push("/wallets")}
            />
            <QuickAction
              icon="label"
              title="LABELS"
              color="bg-gradient-to-br from-pink-500 to-pink-700"
              onPress={() => router.push("/labels")}
            />
            <QuickAction
              icon="analytics"
              title="RAPPORT"
              color="bg-gradient-to-br from-indigo-500 to-indigo-700"
              onPress={() =>
                Alert.alert(
                  "Rapports",
                  "Les rapports seront disponibles dans une prochaine mise à jour",
                )
              }
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} className="mt-10">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className={`text-xl font-bold ${theme === "dark" ? "text-cyan-300" : "text-cyan-600"} tracking-wide ${theme === "dark" ? "neon-text" : "neon-text-light"}`}
              >
                PORTEFEUILLES
              </Text>
              <TouchableOpacity onPress={() => router.push("/wallets")}>
                <Text
                  className={`${theme === "dark" ? "text-cyan-400" : "text-cyan-600"} font-medium tracking-wide ${theme === "dark" ? "neon-text" : ""}`}
                >
                  VOIR TOUT
                </Text>
              </TouchableOpacity>
            </View>

            {wallets.length === 0 ? (
              <View
                className={`${theme === "dark" ? "bg-black/50 border-cyan-500/20" : "bg-cyan-50/50 border-cyan-300/30"} rounded-xl p-6 border items-center`}
              >
                <MaterialIcons
                  name="account-balance-wallet"
                  size={40}
                  color={theme === "dark" ? "#06b6d4" : "#0891b2"}
                />
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-cyan-800"} text-lg mt-2`}
                >
                  Aucun portefeuille
                </Text>
                <Text
                  className={`${theme === "dark" ? "text-cyan-300/70" : "text-cyan-600/70"} text-center mt-1`}
                >
                  Créez votre premier portefeuille pour commencer
                </Text>
              </View>
            ) : (
              wallets.slice(0, 3).map((wallet, index) => {
                const colors = getWalletTypeColor(wallet.type);
                return (
                  <Animated.View
                    key={wallet.id}
                    entering={FadeInUp.delay(500 + index * 100)}
                    className={`${theme === "dark" ? "bg-black/50 border-cyan-500/20" : "bg-cyan-50/50 border-cyan-300/30"} rounded-xl p-4 mb-3 border shadow-sm`}
                  >
                    <TouchableOpacity onPress={() => router.push("/wallets")}>
                      <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                          <Text
                            className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} text-lg`}
                          >
                            {wallet.name}
                          </Text>
                          {wallet.description && (
                            <Text
                              className={`${theme === "dark" ? "text-cyan-300/70" : "text-cyan-600/70"} text-sm mt-1`}
                            >
                              {wallet.description}
                            </Text>
                          )}
                          <Text
                            className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-lg font-bold mt-2`}
                          >
                            {wallet.amount.toLocaleString("fr-FR")} Ar
                          </Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full ${colors.bg}`}>
                          <Text className={`text-xs font-bold ${colors.text}`}>
                            {wallet.type}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })
            )}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600)} className="mt-8 mb-10">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className={`text-xl font-bold ${theme === "dark" ? "text-cyan-300" : "text-cyan-600"} tracking-wide ${theme === "dark" ? "neon-text" : "neon-text-light"}`}
              >
                TRANSACTIONS RÉCENTES
              </Text>
              <TouchableOpacity onPress={() => router.push("/transactions")}>
                <Text
                  className={`${theme === "dark" ? "text-cyan-400" : "text-cyan-600"} font-medium tracking-wide ${theme === "dark" ? "neon-text" : ""}`}
                >
                  VOIR TOUT
                </Text>
              </TouchableOpacity>
            </View>

            {transactions.length === 0 ? (
              <View
                className={`${theme === "dark" ? "bg-black/50 border-cyan-500/20" : "bg-cyan-50/50 border-cyan-300/30"} rounded-xl p-6 border items-center`}
              >
                <MaterialIcons
                  name="receipt"
                  size={40}
                  color={theme === "dark" ? "#06b6d4" : "#0891b2"}
                />
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-lg mt-2`}
                >
                  Aucune transaction
                </Text>
                <Text
                  className={`${theme === "dark" ? "text-cyan-300/70" : "text-cyan-600/70"} text-center mt-1`}
                >
                  Créez votre première transaction
                </Text>
              </View>
            ) : (
              transactions.slice(0, 5).map((transaction, index) => (
                <Animated.View
                  key={transaction.id}
                  entering={FadeInUp.delay(700 + index * 100)}
                  className={`${theme === "dark" ? "bg-black/50 border-cyan-500/20" : "bg-cyan-50/50 border-cyan-300/30"} rounded-xl p-4 mb-3 border shadow-sm`}
                >
                  <TouchableOpacity
                    onPress={() => router.push("/transactions")}
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text
                          className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {transaction.description ||
                            "Transaction sans description"}
                        </Text>
                        <Text
                          className={`${theme === "dark" ? "text-cyan-300/70" : "text-cyan-600/70"} text-sm mt-1`}
                        >
                          {new Date(transaction.date).toLocaleDateString(
                            "fr-FR",
                          )}
                        </Text>
                        {transaction.labels &&
                          transaction.labels.length > 0 && (
                            <View className="flex-row flex-wrap mt-2">
                              {transaction.labels
                                .slice(0, 3)
                                .map((label, i) => (
                                  <View
                                    key={i}
                                    className={`${theme === "dark" ? "bg-cyan-500/10 border-cyan-500/20" : "bg-cyan-400/10 border-cyan-400/20"} px-2 py-1 rounded mr-2 mb-1 border`}
                                  >
                                    <Text
                                      className={`text-xs ${theme === "dark" ? "text-cyan-300" : "text-cyan-600"}`}
                                    >
                                      {label.name}
                                    </Text>
                                  </View>
                                ))}
                            </View>
                          )}
                      </View>
                      <Text
                        className={`text-lg font-bold ${transaction.type === "IN" ? (theme === "dark" ? "text-green-400" : "text-green-600") : theme === "dark" ? "text-red-400" : "text-red-600"}`}
                      >
                        {transaction.type === "IN" ? "+" : "-"}
                        {transaction.amount.toLocaleString("fr-FR")} Ar
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </>
  );
}

// import { Redirect } from "expo-router";
// import React from "react";

// export default function index() {
//   return <Redirect href="/transactions" />;
// }
