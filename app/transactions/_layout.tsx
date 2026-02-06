import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#A74BCA",
        tabBarStyle: {
          backgroundColor: "#0D1744",
        },
        headerStyle: {
          backgroundColor: "#3CA1C9",
        },
        headerTintColor: "#8b5cf6",
        headerTitleStyle: {
          fontWeight: "900",
          fontSize: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Transactions",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="wallet"
              size={24}
              color={focused ? "#A74BCA" : "#94a3b8"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="PostTransaction"
        options={{
          title: "New Transaction",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="add-circle"
              size={24}
              color={focused ? "#A74BCA" : "#94a3b8"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
