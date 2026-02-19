import React from "react";
import { Pressable, Text, View } from "react-native";

export default function FilterTransaction({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <View className="p-4">
      <Text className="text-gray-700 font-bold text-lg mb-2">
        Filter Options
      </Text>
      <Text className="text-gray-600 mb-1">- Par date</Text>
      <Text className="text-gray-600 mb-1">- Par catégorie</Text>
      <Pressable
        onPress={onClose}
        className="mt-4 bg-purple-500 py-2 px-4 rounded-lg"
      >
        <Text className="text-white text-center font-bold">Close</Text>
      </Pressable>
    </View>
  );
}
