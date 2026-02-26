import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Provider } from "react-native-paper";

export default function Layout() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <Provider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
          },
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              name="chevron-back"
              size={24}
              onPress={() => router.push("/(tabs)")}
              className="mx-6"
              color={"#A74BCA"}
            />
          ),
          headerTitle: () => (
            <View className="flex-row items-center gap-3">
              <FontAwesome6
                name="money-bill-transfer"
                size={22}
                color="#A74BCA"
              />
              <Text className="font-bold text-2xl text-[#A74BCA]">
                Transactions
              </Text>
            </View>
          ),
          headerRight: () => (
            <View className="flex-row items-center mr-4">
              <TouchableOpacity onPress={toggleTheme} className="mr-4">
                <MaterialIcons
                  name={theme === "dark" ? "light-mode" : "dark-mode"}
                  size={24}
                  color={theme === "dark" ? "#06b6d4" : "#A74BCA"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <MaterialIcons
                  name="logout"
                  size={24}
                  color={theme === "dark" ? "#06b6d4" : "#0891b2"}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Provider>
  );
}
