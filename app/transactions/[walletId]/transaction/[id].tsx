import UpdateTransaction from "@/components/UpdateTransaction";
import { useAuth } from "@/context/AuthContext";
import { getLabels } from "@/hooks/labelHooks";
import { getWallet } from "@/hooks/walletHooks";
import { transactionAPI } from "@/services/api";
import { Transaction } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function TransactionDetails() {
  const { id, walletId } = useLocalSearchParams();
  const { user } = useAuth();
  const fetchWallets = getWallet();
  const fetchLabels = getLabels();
  const [transactionOne, setTransactionOne] = useState<Transaction>();
  const [edited, setEdited] = useState(false);

  const fetched = async () => {
    try {
      const response: Transaction = await transactionAPI
        .getOne(user?.id || "", walletId.toString(), id.toString())
        .then((res) => res.data);
      console.log("Transaction get One success");
      setTransactionOne(response);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Erreur", "Impossible de charger");
    }
  };

  useEffect(() => {
    fetched();
    fetchWallets();
    fetchLabels();
  }, [user?.id]);

  return (
    <View className="p-5">
      <View className="flex w-full items-end">
        {edited ? (
          <Pressable className="right-0" onPress={() => setEdited(false)}>
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
        ) : (
          <Pressable className="right-0" onPress={() => setEdited(true)}>
            <FontAwesome name="edit" size={24} color="black" />
          </Pressable>
        )}
      </View>
      {edited ? (
        transactionOne && <UpdateTransaction data={transactionOne} />
      ) : (
        <Text className="text-xl font-bold">
          Transaction Details for ID: {id}
        </Text>
      )}
    </View>
  );
}
