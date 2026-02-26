import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import FilterOptionsTransaction from "./FilterOptionsTransaction";

export default function FilterTransaction() {
  const [isOpen, setIsOpen] = useState(false);

  // Shared value pour animation
  const progress = useSharedValue(0);

  const toggleFilter = () => {
    const newValue = !isOpen;
    setIsOpen(newValue);

    progress.value = withTiming(newValue ? 1 : 0, {
      duration: 300,
    });
  };

  // Style animé
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        {
          translateY: withTiming(progress.value ? 0 : -20),
        },
      ],
      height: withTiming(progress.value ? 700 : 0),
      overflow: "hidden",
    };
  });

  return (
    <View className="bg-transparent">
      {/* Bouton Toggle */}
      <Pressable
        onPress={toggleFilter}
        className="mx-4 mb-4 bg-purple-600 rounded-2xl py-4 shadow flex flex-row gap-2 justify-center items-center"
      >
        {isOpen ? (
          <MaterialIcons name="arrow-upward" size={20} color="white" />
        ) : (
          <MaterialIcons name="arrow-downward" size={20} color="white" />
        )}
        <Text className="text-white mt-1 font-bold">
          Filtrer les transactions
        </Text>
      </Pressable>

      {/* Animated Filter */}
      <Animated.View
        style={[
          animatedStyle,
          {
            backgroundColor: "white",
            borderRadius: 20,
            marginHorizontal: 16,
          },
        ]}
      >
        <FilterOptionsTransaction onClose={toggleFilter} />
      </Animated.View>
    </View>
  );
}
