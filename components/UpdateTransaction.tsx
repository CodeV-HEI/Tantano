import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { transactionAPI } from "@/services/api";
import { useTransactionStore } from "@/stores/useTransactionStore";
import {
  CreationTransaction,
  Goal,
  Label,
  Transaction,
  TransactionType,
  Wallet,
} from "@/types";
import { MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";
import Loader from "./Loader";

const transactionTypeSelected = [
  { id: "IN", name: "Ajouter" },
  { id: "OUT", name: "Retirer" },
];

export default function UpdateTransaction({ data }: { data: Transaction }) {
  const { user } = useAuth();
  const [type, setType] = useState<TransactionType>(data.type);
  const [description, setDescription] = useState<string | undefined>(
    data.description,
  );
  const [amount, setAmount] = useState<number>(data.amount);

  const labelIds = data.labels?.map((label) => label.id) || [];
  const [selectedLabels, setSelectedLabels] = useState<string[]>(labelIds);

  const { wallets, labels, goals } = useTransactionStore();
  const walletForThis = wallets.find((wallet) => wallet.id === data.walletId);
  const [valueWallet, setValueWallet] = useState<Wallet | undefined>(
    walletForThis,
  );
  const goalForThis = goals.find((goal) => goal.id === data.goalId)
  const [valueGoal, setValueGoal] = useState<Goal | undefined>(goalForThis);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark
    ? "bg-neutral-900 border border-white/5"
    : "bg-white border border-gray-100";

  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const inputBackground = isDark ? "#18181B" : "#F9FAFB";
  const dropdownBg = isDark ? "#171717" : "#FFFFFF";
  const dropdownBorder = isDark ? "#2A2A2A" : "#E5E7EB";
  const shadow = isDark ? {} : styles.shadowLight;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangeNumber = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(Number(numericValue));
  };

  const handleSubmit = async () => {
    if (
      !valueWallet ||
      !valueGoal ||
      selectedLabels === null ||
      selectedLabels.length === 0 ||
      type === undefined
    ) {
      Toast.show({
        type: "error",
        text1: "Champs manquants",
        text2:
          "Veuillez sélectionner un portefeuille, au moins une étiquette et un type.",
      });
      return;
    }

    const labelSubmit: Label[] = selectedLabels
      .map((id) => {
        const label = labels.find((l) => l.id === id);
        if (label) {
          const { _index, ...labelWithoutIndex } = label as any;
          return labelWithoutIndex;
        }
        return null;
      })
      .filter((l) => l !== null);

    const dateToday = new Date(data.date).toISOString();
    // const dateToday = new Date().toISOString();
    const acountId = user?.id || "";

    const dataSend: CreationTransaction = {
      date: dateToday,
      labels: labelSubmit,
      type: type,
      description: description,
      amount: amount,
      walletId: valueWallet.id,
      accountId: acountId,
      goalId: valueGoal?.id,
    };

    try {
      setIsLoading(true);
      await transactionAPI.update(acountId, valueWallet.id, data.id, dataSend);
      console.log("Transaction mise à jour avec succès");
      Toast.show({
        type: "success",
        text1: "Transaction mise à jour",
        text2: "La transaction a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la création de la transaction :", error);
      Toast.show({
        type: "error",
        text1: "Erreur de mise à jour",
        text2:
          "Une erreur est survenue lors de la mise à jour de la transaction.",
      });
      return;
    } finally {
      setIsLoading(false);
      router.push("/transactions");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center w-full h-screen">
        <Loader />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 10, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HEADER ===== */}
        <View className="mb-6">
          <Text className={`text-2xl font-bold ${textPrimary}`}>
            Modifier Transaction
          </Text>
          <Text className={`mt-1 ${textSecondary}`}>
            Mettre à jour les informations
          </Text>
        </View>

        {/* ===== FORM CARD ===== */}
        <View
          className={`${cardBg} rounded-3xl p-5 shadow-sm border border-gray-100 ${shadow}`}
        >
          {/* Wallet */}
          <Text className={`text-lg mb-2 ${textSecondary}`}>Portefeuille</Text>
          <Dropdown
            style={[
              styles.dropdown,
              {
                backgroundColor: dropdownBg,
                borderColor: "#A78BFA",
              },
            ]}
            iconColor="#A78BFA"
            placeholderStyle={{ color: "#A78BFA" }}
            selectedTextStyle={[
              styles.itemTextStyle,
              {
                color: "#A78BFA",
              },
            ]}
            containerStyle={{
              borderWidth: 1.5,
              borderColor: valueWallet ? "#7C3AED" : dropdownBorder,
              borderRadius: 20,
              padding: 8,
              backgroundColor: isDark ? "#171717" : "#FFFFFF",
            }}
            data={wallets}
            labelField="name"
            valueField="id"
            placeholder="Choisir un portefeuille"
            value={valueWallet?.id}
            onChange={(item: Wallet) => setValueWallet(item)}
            renderItem={(item) => (
              <View
                style={{
                  backgroundColor: isDark ? "#171717" : "#FFFFFF",
                }}
                className={`flex flex-row py-4 px-2`}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  {item.iconRef ? (
                    <Image
                      source={{ uri: item.iconRef }}
                      style={{ width: 22, height: 22, marginRight: 14 }}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="wallet-bifold"
                      size={22}
                      color={
                        valueWallet?.id === item.id ? "#A78BFA" : "#6B7280"
                      }
                    />
                  )}

                  <Text
                    style={[
                      styles.itemTextStyle,
                      {
                        color:
                          valueWallet?.id === item.id ? "#A78BFA" : "#6B7280",
                        fontWeight: valueWallet?.id === item.id ? "600" : "500",
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>

                {valueWallet?.id === item.id && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#A78BFA"
                  />
                )}
              </View>
            )}
          />

          {/* Gaol */}
          <Text className={`text-lg mb-2 ${textSecondary}`}>Objectif</Text>
          <Dropdown
            style={[
              styles.dropdown,
              {
                backgroundColor: dropdownBg,
                borderColor: "#A78BFA",
              },
            ]}
            iconColor="#A78BFA"
            placeholderStyle={{ color: "#A78BFA" }}
            selectedTextStyle={[
              styles.itemTextStyle,
              {
                color: "#A78BFA",
              },
            ]}
            containerStyle={{
              borderWidth: 1.5,
              borderColor: valueGoal ? "#7C3AED" : dropdownBorder,
              borderRadius: 20,
              padding: 8,
              backgroundColor: isDark ? "#171717" : "#FFFFFF",
            }}
            data={goals}
            labelField="name"
            valueField="id"
            placeholder="Choisir un Objectif"
            value={valueGoal?.id}
            onChange={(item: Goal) => setValueGoal(item)}
            renderItem={(item) => (
              <View
                style={{
                  backgroundColor: isDark ? "#171717" : "#FFFFFF",
                }}
                className={`flex flex-row py-4 px-2`}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  {item.iconRef ? (
                    <Image
                      source={{ uri: item.iconRef }}
                      style={{ width: 22, height: 22, marginRight: 14 }}
                    />
                  ) : (
                   <Octicons
                      name="goal"
                      size={22}
                      color={
                        valueGoal?.id === item.id ? "#A78BFA" : "#6B7280"
                      }
                    />
                  )}

                  <Text
                    style={[
                      styles.itemTextStyle,
                      {
                        color:
                          valueGoal?.id === item.id ? "#A78BFA" : "#6B7280",
                        fontWeight: valueGoal?.id === item.id ? "600" : "500",
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>

                {valueGoal?.id === item.id && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#A78BFA"
                  />
                )}
              </View>
            )}
          />

          {/* Labels */}
          <Text className={`text-lg mb-2 ${textSecondary}`}>Etiquettes</Text>
          <MultiSelect
            style={[
              styles.dropdown,
              {
                backgroundColor: dropdownBg,
                borderColor: "#A78BFA",
              },
            ]}
            placeholderStyle={{ color: "#A78BFA" }}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={{
              borderWidth: 1.5,
              borderRadius: 20,
              padding: 8,
              backgroundColor: isDark ? "#171717" : "#FFFFFF",
            }}
            data={labels}
            labelField="name"
            valueField="id"
            placeholder="Choisir des étiquettes"
            value={selectedLabels}
            onChange={(items: string[]) => setSelectedLabels(items)}
            renderSelectedItem={(item) => (
              <View>
                <View
                  key={item.id}
                  className="p-4 mx-4 my-2 rounded-lg flex-row items-center"
                  style={{ backgroundColor: item.color + "22" }}
                >
                  {item.iconRef ? (
                    <Image
                      source={{ uri: item.iconRef }}
                      style={{ width: 16, height: 16, marginRight: 8 }}
                    />
                  ) : (
                    <MaterialIcons
                      name="label"
                      size={16}
                      color={item.color}
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Text
                    className={`text-xs font-semibold ${theme === "dark" ? "text-white" : ""}`}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            )}
            renderItem={(item) => {
              const isSelected = selectedLabels.includes(item.id);

              return (
                <View
                  className={`flex flex-row py-4 px-2 rounded-lg`}
                  style={[isSelected && styles.selectedItem]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <MaterialIcons
                      name="label"
                      size={20}
                      color={isSelected ? "#A78BFA" : "#6B7280"}
                    />

                    <Text
                      style={[
                        styles.itemTextStyle,
                        { color: isSelected ? "#A78BFA" : "#6B7280" },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>

                  {isSelected && (
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color="#A78BFA"
                    />
                  )}
                </View>
              );
            }}
          />

          {/* Type */}
          <Text className={`text-lg mb-2 ${textSecondary}`}>Type</Text>
          <Dropdown
            style={[
              styles.dropdown,
              {
                backgroundColor: dropdownBg,
                borderColor:
                  type === TransactionType.IN ? "#22c55e" : "#ef4444",
              },
            ]}
            iconColor={type === TransactionType.IN ? "#22c55e" : "#ef4444"}
            data={transactionTypeSelected}
            labelField="name"
            valueField="id"
            placeholder="Type de transaction"
            selectedTextStyle={[
              styles.itemTextStyle,
              {
                color: type === TransactionType.IN ? "#22c55e" : "#ef4444",
              },
            ]}
            containerStyle={{
              borderWidth: 1.5,
              borderColor: type === TransactionType.IN ? "#22c55e" : "#ef4444",
              borderRadius: 20,
              padding: 8,
              backgroundColor: isDark ? "#171717" : "#FFFFFF",
            }}
            value={type}
            onChange={(item: any) => setType(item.id)}
            renderItem={(item) => (
              <View
                style={{
                  backgroundColor: isDark ? "#171717" : "#FFFFFF",
                }}
                className={`flex flex-row py-4 px-2`}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                  className={`${item.id === TransactionType.IN ? "bg-green-50" : "bg-red-50"} py-4 px-4 rounded-lg`}
                >
                  <MaterialCommunityIcons
                    name={item.id === TransactionType.IN ? "plus" : "minus"}
                    size={22}
                    color={item.id === TransactionType.IN ? "green" : "red"}
                  />

                  <Text
                    style={[
                      styles.itemTextStyle,
                      {
                        color: item.id === TransactionType.IN ? "green" : "red",
                        fontWeight: item?.id === item.id ? "600" : "500",
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* Description */}
          <Text className={`text-lg mb-2 ${textSecondary}`}>Description</Text>
          <TextInput
            style={{
              height: 55,
              backgroundColor: inputBackground,
              borderWidth: 1.5,
              borderColor: "#A78BFA",
              borderRadius: 16,
              paddingHorizontal: 16,
              color: isDark ? "#FFFFFF" : "#111827",
              fontSize: 15,
              marginBottom: 22,
            }}
            placeholderTextColor="#A78BFA"
            placeholder="Ex: Paiement facture"
            value={description}
            onChangeText={setDescription}
          />

          {/* Amount */}
          <Text className={`text-lg mb-2 ${textSecondary}`}>Montant</Text>
          <TextInput
            style={{
              height: 55,
              backgroundColor: inputBackground,
              borderWidth: 1.5,
              borderColor: "#A78BFA",
              borderRadius: 16,
              paddingHorizontal: 16,
              color: isDark ? "#FFFFFF" : "#111827",
              fontSize: 15,
            }}
            placeholderTextColor="#A78BFA"
            keyboardType="numeric"
            onChangeText={handleChangeNumber}
            value={amount.toString()}
            placeholder="0"
          />

          <Text className="text-right text-xs text-gray-400">Ariary (Ar)</Text>
        </View>

        {/* ===== CTA BUTTON ===== */}
        <Pressable
          onPress={handleSubmit}
          className="bg-root-purple p-5 rounded-2xl mt-6 shadow-sm active:scale-[0.98]"
        >
          <Text className="text-white text-center font-bold text-lg">
            Mettre à jour la transaction
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  dropdownFocused: {
    borderColor: "#7C3AED",
    shadowOpacity: 0.15,
  },

  selectedItem: {
    backgroundColor: "#64748b",
  },

  itemTextStyle: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    marginLeft: 12,
  },

  placeholderStyle: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  selectedTextStyle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  shadowLight: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
