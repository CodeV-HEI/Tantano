import { useAuth } from "@/context/AuthContext";
import { transactionAPI } from "@/services/api";
import { useLabelStore } from "@/store/useLabelStore";
import { useWalletStore } from "@/store/useWalletStore";
import {
  CreationTransaction,
  TransactionType,
  Wallet
} from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

const TransactionTypeSelected = [
  { id: "IN", name: "Ajouter" },
  { id: "OUT", name: "Retirer" },
];

export default function FormTrasansction() {
  const { wallets } = useWalletStore();
  const [valueWallet, setValueWallet] = useState<Wallet | null>(null);
  const { labels } = useLabelStore();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const { user } = useAuth();
  const [type, setType] = useState<TransactionType>(TransactionType.IN);
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const handleChangeNumber = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(Number(numericValue));
  };

  const handleSubmit = async () => {
    if (
      !valueWallet ||
      selectedLabels === null ||
      selectedLabels.length === 0
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs !");
      return;
    }

    const labelSubmit = selectedLabels
      .map((id) => {
        const label = labels.find((l) => l.id === id);
        if (label) {
          const { _index, ...labelWithoutIndex } = label as any;
          return labelWithoutIndex;
        }
        return null;
      })
      .filter((l) => l !== null);

    const dateToday = new Date().toLocaleString();
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
      const response = await transactionAPI.create(
        acountId,
        valueWallet.id,
        dataSend,
      );
      console.log("Réponse de l'API :", response);
      Alert.alert("Succès", "Transaction créée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création de la transaction :", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création de la transaction.",
      );
    } finally {
      router.push("/transactions");
    }
  };

  return (
    <View className="p-5 justify-center">
      <Dropdown
        style={styles.dropdown}
        data={wallets}
        labelField="name"
        valueField="id"
        placeholder="Portefeuille"
        value={valueWallet?.id}
        onChange={(item: Wallet) => {
          setValueWallet(item);
        }}
      />

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

      <Dropdown
        style={styles.dropdown}
        data={TransactionTypeSelected}
        labelField="name"
        valueField="id"
        placeholder="Type de transaction"
        value={type}
        onChange={(item: any) => {
          setType(item.id as TransactionType);
        }}
      />

      <TextInput
        className="h-[55px] bg-white border-[#E0E0E0] border rounded-[12px] px-[15px] mb-[25px] shadow-sm"
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        className="h-[55px] bg-white border-[#E0E0E0] border rounded-[12px] px-[15px] mb-[25px] shadow-sm"
        keyboardType="numeric"
        onChangeText={handleChangeNumber}
        value={amount.toString()}
        placeholder="Entrez un nombre"
      />

      <Pressable
        onPress={handleSubmit}
        className="bg-root-purple p-4 rounded-lg mt-5"
      >
        <Text className="text-white text-center font-semibold">
          Créer la transaction
        </Text>
      </Pressable>
    </View>
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
