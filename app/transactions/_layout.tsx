import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#A74BCA",
        tabBarStyle: {
          backgroundColor: "#F0F0F0",
          borderTopColor: "#00F2FF",
          borderTopWidth: 2,
        },
        headerShown: true,
        headerTitle: () => (
          <View className="justify-center flex-row items-center w-56 gap-4">
            <FontAwesome6
              name="money-bill-trend-up"
              size={24}
              color="#A74BCA"
            />
            <Text className="font-bold text-root-purple text-4xl -bottom-1">
              Transactions
            </Text>
          </View>
        ),
        headerStyle: {
          borderBottomColor: "#00F2FF",
          borderBottomWidth: 2,
        },
      }}
    >
      <Tabs.Screen
        name="listTransactions"
        options={{
          title: "Listes",
          tabBarIcon(props) {
            return <MaterialIcons name="list" size={24} color={props.color} />;
          },
        }}
      />
      <Tabs.Screen
        name="createTransaction"
        options={{
          title: "Créer",
          tabBarIcon(props) {
            return (
              <MaterialIcons name="add-circle" size={24} color={props.color} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notifications",
          tabBarIcon(props) {
            return (
              <MaterialIcons
                name="notifications"
                size={24}
                color={props.color}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}
