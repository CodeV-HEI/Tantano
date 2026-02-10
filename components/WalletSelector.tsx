import { useWalletStore } from "@/store/useWalletStore";
import { WalletSimple } from "@/types";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function WalletSelector() {
  const { wallets } = useWalletStore();
  const [value, setValue] = useState({ id: "", name: "", type: "" });

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        data={wallets}
        labelField="name"
        valueField="id"
        placeholder="Portefeuille"
        value={value.id}
        onChange={(item: WalletSimple) => {
          setValue({ id: item.id, name: item.name, type: item.type });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, justifyContent: "center", flex: 1 },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
