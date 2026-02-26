import { useAuth } from "@/context/AuthContext";
import { transactionAPI } from "@/services/api";
import { useTransactionStore } from "@/store/useTransactionStore";
import {
  CreationTransaction,
  Label,
  Transaction,
  TransactionType,
  Wallet,
} from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
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

  const { wallets, labels } = useTransactionStore();
  const walletForThis = wallets.find((wallet) => wallet.id === data.walletId);
  const [valueWallet, setValueWallet] = useState<Wallet | undefined>(
    walletForThis,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangeNumber = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(Number(numericValue));
  };

  const handleSubmit = async () => {
    if (
      !valueWallet ||
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
    };

    try {
      setIsLoading(true);
      await transactionAPI.update(acountId, valueWallet.id, data.id, dataSend);
      console.log("Transaction mise à jour avec succès :");
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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 10, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HEADER ===== */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Modifier Transaction
          </Text>
          <Text className="text-gray-400 mt-1">
            Mettre à jour les informations
          </Text>
        </View>

        {/* ===== FORM CARD ===== */}
        <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          {/* Wallet */}
          <Text className="text-xs text-gray-400 mb-2">Wallet</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={{
              borderRadius: 20,
              padding: 8,
            }}
            data={wallets}
            labelField="name"
            valueField="id"
            placeholder="Choisir un portefeuille"
            value={valueWallet?.id}
            onChange={(item: Wallet) => setValueWallet(item)}
            renderItem={(item) => (
              <View
                style={[
                  styles.itemStyle,
                  valueWallet?.id === item.id && styles.selectedItem,
                ]}
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
                      style={{ width: 22, height: 22, marginRight: 12 }}
                    />
                  ) : (
                    <MaterialIcons
                      name="account-balance-wallet"
                      size={22}
                      color="#7C3AED"
                    />
                  )}

                  <Text style={styles.itemTextStyle}>{item.name}</Text>
                </View>

                {valueWallet?.id === item.id && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#7C3AED"
                  />
                )}
              </View>
            )}
          />

          {/* Labels */}
          <Text className="text-xs text-gray-400 mb-2">Etiquettes</Text>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={{
              borderRadius: 20,
              padding: 8,
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
                  <Text className="text-xs font-semibold">{item.name}</Text>
                </View>
              </View>
            )}
            renderItem={(item) => {
              const isSelected = selectedLabels.includes(item.id);

              return (
                <View
                  style={[styles.itemStyle, isSelected && styles.selectedItem]}
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
                      color={isSelected ? "#7C3AED" : "#9CA3AF"}
                    />

                    <Text
                      style={[
                        styles.itemTextStyle,
                        { color: isSelected ? "#6D28D9" : "#374151" },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>

                  {isSelected && (
                    <MaterialIcons name="check" size={20} color="#7C3AED" />
                  )}
                </View>
              );
            }}
          />

          {/* Type */}
          <Text className="text-xs text-gray-400 mb-2">Type</Text>
          <Dropdown
            style={styles.dropdown}
            data={transactionTypeSelected}
            labelField="name"
            valueField="id"
            placeholder="Type de transaction"
            value={type}
            onChange={(item: any) => setType(item.id)}
            renderItem={(item) => (
              <View style={styles.itemStyle}>
                {/* Icône à gauche */}
                <MaterialIcons
                  name={
                    item.id === TransactionType.IN
                      ? "arrow-upward"
                      : "arrow-downward"
                  }
                  size={20}
                  color={item.id === TransactionType.IN ? "green" : "red"}
                />
                <Text
                  style={styles.itemTextStyle}
                  className={
                    item.id === TransactionType.IN
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {item.name}
                </Text>
                {/* Check si sélectionné */}
                {item.id === type && (
                  <MaterialIcons name="check" size={20} color="#6200EE" />
                )}
              </View>
            )}
          />

          {/* Description */}
          <Text className="text-xs text-gray-400 mb-2">Description</Text>
          <TextInput
            className="h-[55px] bg-gray-50 border border-gray-200 rounded-xl px-4 mb-5"
            placeholder="Ex: Paiement facture"
            value={description}
            onChangeText={setDescription}
          />

          {/* Amount */}
          <Text className="text-xs text-gray-400 mb-2">Montant</Text>
          <TextInput
            className="h-[55px] bg-gray-50 border border-gray-200 rounded-xl px-4 mb-2 text-lg font-semibold"
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

  itemStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
  },

  selectedItem: {
    backgroundColor: "#F3E8FF",
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
});
