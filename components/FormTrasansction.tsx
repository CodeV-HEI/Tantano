import { useLabelStore } from "@/store/useLabelStore";
import { useWalletStore } from "@/store/useWalletStore";
import { WalletSimple } from "@/types";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

export default function FormTrasansction() {
  const { wallets } = useWalletStore();
  const [valueWallet, setValueWallet] = useState<WalletSimple | null>(null);
  const { labels } = useLabelStore();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const handleSubmit = () => {
    if (
      !valueWallet ||
      selectedLabels === null ||
      selectedLabels.length === 0
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs !");
      return;
    }

    const labelSubmit = selectedLabels.map((id) =>
      labels.find((label) => label.id === id),
    );

    const dateToday = new Date().toLocaleString();

    console.log("Envoi des données :", {
      dateToday,
      valueWallet,
      selectedLabels,
      labelSubmit,
    });
    Alert.alert("Succès", "Transaction créée avec succès !");
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
        onChange={(item: WalletSimple) => {
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
    elevation: 2, // Petit ombre sur Android
  },
  selectedStyle: { borderRadius: 10, backgroundColor: "#E3F2FD" },
});
