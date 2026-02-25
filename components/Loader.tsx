import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Chargement...</Text>
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
