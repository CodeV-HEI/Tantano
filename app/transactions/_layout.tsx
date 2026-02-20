import FilterTransaction from "@/components/FilterTransaction";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useRef, useState } from "react";
import { Animated, Dimensions, Easing, Text, View } from "react-native";
import { Menu, Provider } from "react-native-paper";

const { height } = Dimensions.get("window");

export default function Layout() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const translateY = useRef(new Animated.Value(height)).current;

  const openFilter = () => {
    setFilterVisible(true);
    Animated.timing(translateY, {
      toValue: height / 3,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setFilterVisible(false));
  };

  return (
    <Provider>
      <Stack
        screenOptions={{
          headerShown: true,
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
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <MaterialIcons
                  name="more-vert"
                  size={26}
                  color="#A74BCA"
                  onPress={() => setMenuVisible(true)}
                />
              }
              contentStyle={{ backgroundColor: "white", borderRadius: 8 }}
            >
              <Menu.Item
                leadingIcon={(props) => (
                  <MaterialIcons
                    name="filter-list"
                    size={props.size}
                    color="#A74BCA"
                  />
                )}
                onPress={() => {
                  setMenuVisible(false);
                  openFilter();
                }}
                title="Filtrer"
                titleStyle={{ color: "#A74BCA", fontWeight: "bold" }}
              />
              <Menu.Item
                leadingIcon={(props) => (
                  <MaterialIcons
                    name="add-circle-outline"
                    size={props.size}
                    color="#A74BCA"
                  />
                )}
                onPress={() => {
                  setMenuVisible(false);
                  router.push("/transactions/create");
                }}
                title="Créer"
                titleStyle={{ color: "#A74BCA", fontWeight: "bold" }}
              />
            </Menu>
          ),
        }}
      />

      {filterVisible && (
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: height * 0.4,
            backgroundColor: "white",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            zIndex: 1000,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 10,
          }}
        >
          <FilterTransaction onClose={closeFilter} />
        </Animated.View>
      )}
    </Provider>
  );
}
