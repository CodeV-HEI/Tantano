import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function TransactionDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View className="p-5">
      <Text className="text-xl font-bold">
        Transaction Details for ID: {id}
      </Text>
    </View>
  );
}
