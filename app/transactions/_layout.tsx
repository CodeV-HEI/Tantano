import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <View className="justify-center flex-row items-center w-56 gap-4">
            <FontAwesome6
              name="money-bill-transfer"
              size={24}
              color="#A74BCA"
            />
            <Text className="font-bold text-root-purple text-4xl">
              Transactions
            </Text>
          </View>
        ),
        headerRight(props) {
          return (
            <Pressable
              onPress={() => {
                router.push("/transactions/create");
              }}
            >
              <MaterialIcons name="add-box" size={24} color="#A74BCA" />
            </Pressable>
          );
        },
      }}
    />
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: "#A74BCA",
    //     tabBarStyle: {
    //       backgroundColor: "#F0F0F0",
    //       borderTopColor: "#00F2FF",
    //       borderTopWidth: 2,
    //     },
    //     headerShown: true,
    //     headerTitle: () => (
    //       <View className="justify-center flex-row items-center w-56 gap-4">
    //         <FontAwesome6
    //           name="money-bill-transfer"
    //           size={24}
    //           color="#A74BCA"
    //         />
    //         <Text className="font-bold text-root-purple text-4xl">
    //           Transactions
    //         </Text>
    //       </View>
    //     ),
    //     headerStyle: {
    //       borderBottomColor: "#00F2FF",
    //       borderBottomWidth: 2,
    //     },
    //     headerRight(props) {
    //       return (
    //         <Pressable
    //           onPress={() => {
    //             router.push("/transactions/create");
    //           }}
    //         >
    //           <MaterialIcons name="add-box" size={24} color="#A74BCA" />
    //         </Pressable>
    //       );
    //     },
    //     headerRightContainerStyle: {
    //       paddingRight: 30,
    //     },
    //   }}
    // >
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       href: null,
    //       title: "Listes",
    //       tabBarIcon(props) {
    //         return <MaterialIcons name="list" size={24} color={props.color} />;
    //       },
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="create"
    //     options={{
    //       href: null,
    //       title: "Créer",
    //       tabBarIcon(props) {
    //         return (
    //           <MaterialIcons name="add-circle" size={24} color={props.color} />
    //         );
    //       },
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="update"
    //     options={{
    //       href: null,
    //       title: "Modifier",
    //       tabBarIcon(props) {
    //         return <MaterialIcons name="edit" size={24} color={props.color} />;
    //       },
    //     }}
    //   />
    // </Tabs>
  );
}
