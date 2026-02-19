import { useAuth } from "@/context/AuthContext";
import { transactionAPI } from "@/services/api";
import { useLabelStore } from "@/store/useLabelStore";
import { useWalletStore } from "@/store/useWalletStore";
import { CreationTransaction, Label, TransactionType, Wallet } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

const transactionTypeSelected = [
  { id: TransactionType.IN, name: "Ajouter" },
  { id: TransactionType.OUT, name: "Retirer" },
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

    const dateToday = new Date().toISOString();
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
    <ScrollView
      contentContainerStyle={{ padding: 10, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      className="bg-gray-50 p-6"
    >
      {/* ===== HEADER ===== */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">
          Nouvelle Transaction
        </Text>
        <Text className="text-gray-400 mt-1">
          Ajoute une entrée ou une sortie d'argent
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
          renderItem={(item) => (
            <View style={styles.itemStyle}>
              {item.iconRef ? (
                <Image
                  source={{ uri: item.iconRef }}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
              ) : (
                <MaterialIcons name="wallet" size={20} color="#A74BCA" />
              )}

              <Text style={styles.itemTextStyle}>{item.name}</Text>
              {selectedLabels.includes(item.id) && (
                <MaterialIcons name="check" size={20} color="#6200EE" />
              )}
            </View>
          )}
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
          onChange={(items: string[]) => setSelectedLabels(items)}
          renderItem={(item) => (
            <View style={styles.itemStyle}>
              {item.iconRef ? (
                <Image
                  source={{ uri: item.iconRef }}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
              ) : (
                <MaterialIcons name="label" size={20} color="#A74BCA" />
              )}

              <Text style={styles.itemTextStyle}>{item.name}</Text>
              {/* Check si sélectionné */}
              {selectedLabels.includes(item.id) && (
                <MaterialIcons name="check" size={20} color="#6200EE" />
              )}
            </View>
          )}
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
              <Text style={styles.itemTextStyle}>{item.name}</Text>
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
          placeholder="Ex: Achat nourriture"
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

        <Text className="text-right text-xs text-gray-400 mb-4">
          Ariary (Ar)
        </Text>
      </View>

      {/* ===== CTA BUTTON ===== */}
      <Pressable
        onPress={handleSubmit}
        className="bg-root-purple p-5 rounded-2xl mt-6 shadow-sm active:scale-[0.98]"
      >
        <Text className="text-white text-center font-bold text-lg">
          Créer la transaction
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 55,
    backgroundColor: "#FFF",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 25,
    elevation: 3,
  },
  itemStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  itemTextStyle: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginLeft: 10, // espace entre icône et texte
  },
  selectedStyle: {
    borderRadius: 10,
    backgroundColor: "#E3F2FD",
  },
});
