import FilterOptionsTransaction from "@/components/FilterOptionsTransaction";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Provider } from "react-native-paper";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Layout() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);

  const { height } = useWindowDimensions();
  const FILTER_HEIGHT = height * 0.9;

  // valeur partagée pour l'animation
  const translateY = useSharedValue(height);

  const openFilter = () => {
    setShowFilter(true);
    translateY.value = withTiming(height - FILTER_HEIGHT, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  };

  const closeFilter = () => {
    translateY.value = withTiming(
      height,
      {
        duration: 300,
        easing: Easing.in(Easing.ease),
      },
      () => {
        runOnJS(setShowFilter)(false);
      },
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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
              className="mr-6"
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
              <TouchableOpacity onPress={openFilter} className="mr-4">
                <MaterialIcons name="filter-list" size={24} color="#A74BCA" />
              </TouchableOpacity>
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

      {showFilter && (
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: FILTER_HEIGHT,
              backgroundColor: theme === "dark" ? "#111111" : "#ffffff",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
            animatedStyle,
          ]}
        >
          <FilterOptionsTransaction onClose={closeFilter} />
        </Animated.View>
      )}
    </Provider>
  );
}
