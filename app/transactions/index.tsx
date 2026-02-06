// import { router } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  // const goToFormCreate = () => {
  //   router.push("/transactions/PostTransaction");
  // };

  return (
    <View className="h-screen relative">
      {/* <TouchableOpacity
        onPress={goToFormCreate}
        className="border-neon-cyan border absolute bottom-40 right-10 w-20 h-20 rounded-full items-center justify-center"
      >
        <Text className="text-neon-cyan text-6xl">+</Text>
      </TouchableOpacity> */}
      <Text className="text-2xl p-4">Transactions Home Page</Text>
    </View>
  );
}
