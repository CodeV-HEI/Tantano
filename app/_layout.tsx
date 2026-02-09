import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ActivityIndicator, View } from "react-native";
import ThemeWrapper from "@/components/ThemeWrapper";

function RootLayoutContent() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#ff00ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
          <Stack.Screen name="register" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="(tabs)" redirect={true} />
        </>
      ) : (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" redirect={true} />
          <Stack.Screen name="login" redirect={true} />
          <Stack.Screen name="register" redirect={true} />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeWrapper>
          <RootLayoutContent />
        </ThemeWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}
