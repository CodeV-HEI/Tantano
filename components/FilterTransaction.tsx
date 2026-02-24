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
      height: withTiming(progress.value ? 280 : 0),
      overflow: "hidden",
    };
  });

  return (
    <View className="bg-gray-100">
      {/* Bouton Toggle */}
      <Pressable
        onPress={toggleFilter}
        className="mx-4 mb-4 bg-purple-600 rounded-2xl py-3 items-center shadow"
      >
        <Text className="text-white font-bold text-lg">
          {isOpen ? "Fermer le filtre" : "Afficher le filtre"}
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
