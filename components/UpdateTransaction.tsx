import { useAuth } from "@/context/AuthContext";
import { transactionAPI } from "@/services/api";
import { useLabelStore } from "@/store/useLabelStore";
import { useWalletStore } from "@/store/useWalletStore";
import {
  CreationTransaction,
  Label,
  Transaction,
  TransactionType,
  Wallet,
} from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
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

const transactionTypeSelected = [
  { id: "IN", name: "Ajouter" },
  { id: "OUT", name: "Retirer" },
];

export default function UpdateTransaction({ data }: { data: Transaction }) {
  const { wallets } = useWalletStore();
  const { labels } = useLabelStore();
  const { user } = useAuth();
  const [type, setType] = useState<TransactionType>(data.type);
  const [description, setDescription] = useState<string | undefined>(
    data.description,
  );
  const [amount, setAmount] = useState<number>(data.amount);

  const labelIds = data.labels?.map((label) => label.id) || [];
  const [selectedLabels, setSelectedLabels] = useState<string[]>(labelIds);

  const walletForThis = wallets.find((wallet) => wallet.id === data.walletId);
  const [valueWallet, setValueWallet] = useState<Wallet | undefined>(
    walletForThis,
  );

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
      Alert.alert("Erreur", "Veuillez remplir tous les champs !");
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
      const response = await transactionAPI.update(
        acountId,
        valueWallet.id,
        data.id,
        dataSend,
      );
      console.log("Réponse de l'API :", response);
      Alert.alert("Succès", "Mise à jour du transaction avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création de la transaction :", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour de la transaction.",
      );
    } finally {
      router.push("/transactions");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
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
            data={wallets}
            labelField="name"
            valueField="id"
            placeholder="Choisir un portefeuille"
            value={valueWallet?.id}
            onChange={(item: Wallet) => setValueWallet(item)}
          />

          {/* Labels */}
          <Text className="text-xs text-gray-400 mb-2">Catégories</Text>
          <MultiSelect
            style={styles.dropdown}
            data={labels}
            labelField="name"
            valueField="id"
            placeholder="Choisir les catégories"
            value={selectedLabels}
            onChange={(item: any) => setSelectedLabels(item)}
            selectedStyle={styles.selectedStyle}
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
  label: { fontSize: 16, marginBottom: 8, fontWeight: "600", color: "#333" },
  dropdown: {
    height: 55,
    backgroundColor: "white",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
    elevation: 2,
  },
  selectedStyle: { borderRadius: 10, backgroundColor: "#E3F2FD" },
});
