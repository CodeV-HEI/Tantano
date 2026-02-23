import ThemeWrapper from "@/components/ThemeWrapper";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";

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
<<<<<<< HEAD
          <Stack.Screen name="index" options={{ animation: "fade" }} />
          <Stack.Screen name="login" options={{ animation: "fade" }} />
          <Stack.Screen
            name="register"
            options={{ animation: "slide_from_right" }}
          />
=======
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
          <Stack.Screen name="register" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="forgot-password" options={{ animation: 'slide_from_bottom' }} />
>>>>>>> 44342cc (feat: Add forgot password component and update login, register and also _layout component)
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

    <AuthProvider>
      <CurrencyProvider>
        <NotificationProvider>
          <ThemeProvider>
            <ThemeWrapper>
              <ActionSheetProvider>
                <>
                  <RootLayoutContent />
                  <Toast />
                </>
              </ActionSheetProvider>
            </ThemeWrapper>
          </ThemeProvider>
        </NotificationProvider>
      </CurrencyProvider>
    </AuthProvider>

  );
}
