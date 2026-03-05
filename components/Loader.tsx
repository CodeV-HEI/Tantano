import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Loader() {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#000000" : "#ffffff" },
      ]}
    >
      <ActivityIndicator
        size="large"
        color={theme === "dark" ? "#ffffff" : "#0000ff"}
      />
      <Text
        style={[
          styles.text,
          { color: theme === "dark" ? "#ffffff" : "#555555" },
        ]}
      >
        Chargement...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
