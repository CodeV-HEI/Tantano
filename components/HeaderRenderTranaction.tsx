import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function HeaderRenderTranaction() {
  const { theme } = useTheme();
  return (
    <>
      <View className="flex flex-row items-center justify-between">
        <View className="mb-4 px-4 py-6">
          <Text
            className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Transactions
          </Text>
          <Text className="text-gray-400 mt-1">
            Historique de vos opérations
          </Text>
        </View>
        <Pressable
          className="flex-row items-center gap-2 bg-purple-600 rounded-2xl py-3 px-4 mx-4 mb-4 shadow"
          onPress={() => router.push("/transactions/create")}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text className="text-white">Créer</Text>
        </Pressable>
      </View>
    </>
  );
}
