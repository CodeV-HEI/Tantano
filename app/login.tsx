import Background3D from "@/components/Background";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    StatusBar.setBarStyle(theme === "dark" ? "light-content" : "dark-content");
  }, [theme]);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      Toast.show({
        type: "success",
        text1: "Connexion réussie",
        text2: "Bienvenue !",
        position: "top",
        visibilityTime: 2000,
      });
      router.replace("/(tabs)");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Vérifiez vos identifiants";
      Toast.show({
        type: "error",
        text1: "Échec de connexion",
        text2: message,
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegister = () => {
    router.push("/register");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      {/* Background 3D */}
      <Background3D />

      {/* Bouton de changement de thème */}
      <TouchableOpacity
        onPress={toggleTheme}
        className={`absolute top-12 right-6 z-50 p-3 rounded-full ${theme === "dark" ? "bg-black/10 backdrop-blur-sm border border-cyan-500/20" : "bg-cyan-50/80 backdrop-blur-sm border border-cyan-200"}`}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name={theme === "dark" ? "light-mode" : "dark-mode"}
          size={24}
          color={theme === "dark" ? "#06b6d4" : "#0891b2"}
        />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: keyboardVisible ? 100 : 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-16 pb-8 justify-center">
          {!keyboardVisible && (
            <Animated.View
              entering={FadeInDown.duration(1000).springify()}
              className="items-center mb-12"
            >
              <Text
                className={`text-7xl font-bold text-transparent bg-clip-text ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" : "bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300"} ${theme === "dark" ? "neon-text" : "neon-text-light"} mb-3`}
              >
                Tantano
              </Text>
              <Text
                className={`text-lg ${theme === "dark" ? "text-cyan-300/80" : "text-cyan-600/80"} font-light tracking-widest`}
              >
                Financial event recording
              </Text>
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInUp.duration(800).delay(200)}
            className="space-y-8"
          >
            <View className="space-y-3">
              <Text
                className={`${theme === "dark" ? "text-cyan-300" : "text-cyan-600"} font-medium tracking-wide text-base`}
              >
                Nom d&apos;utilisateur
              </Text>
              <TextInput
                className={`${theme === "dark" ? "bg-black/60 border-cyan-500/40 text-white" : "bg-cyan-50/50 border-cyan-300 text-gray-900"} border-2 rounded-xl px-5 py-4 text-lg focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/30`}
                placeholder="Entrez votre nom"
                placeholderTextColor={
                  theme === "dark" ? "#06b6d470" : "#0891b270"
                }
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>

            <View className="space-y-3 mt-4">
              <Text
                className={`${theme === "dark" ? "text-cyan-300" : "text-cyan-600"} font-medium tracking-wide text-base`}
              >
                Mot de passe
              </Text>
              <View className="relative">
                <TextInput
                  className={`${theme === "dark" ? "bg-black/60 border-purple-500/40 text-white" : "bg-purple-50/50 border-purple-300 text-gray-900"} border-2 rounded-xl px-5 py-4 text-lg focus:border-purple-400 focus:shadow-lg focus:shadow-purple-400/30 pr-12`}
                  placeholder="••••••••"
                  placeholderTextColor={
                    theme === "dark" ? "#a855f770" : "#9333ea70"
                  }
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={toggleShowPassword}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff
                      size={24}
                      color={theme === "dark" ? "#a855f7" : "#9333ea"}
                    />
                  ) : (
                    <Eye
                      size={24}
                      color={theme === "dark" ? "#a855f7" : "#9333ea"}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View entering={FadeInUp.delay(400)} className="pt-8">
              <TouchableOpacity
                className={`${isPressed ? (theme === "dark" ? "bg-gray-900" : "bg-gray-100") : theme === "dark" ? "bg-black" : "bg-white"} ${theme === "dark" ? "border-cyan-500/60 shadow-cyan-500/30" : "border-cyan-400/50 shadow-cyan-400/20"} border-2 rounded-xl py-5 ${isLoading ? "opacity-80" : ""} shadow-2xl active:scale-[0.98] flex-row justify-center items-center`}
                onPress={handleLogin}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                {isLoading ? (
                  <View className="flex-row justify-center items-center">
                    <ActivityIndicator
                      size="large"
                      color={theme === "dark" ? "#22d3ee" : "#0891b2"}
                    />
                  </View>
                ) : (
                  <View className="flex-row justify-center items-center w-full">
                    <Text
                      className={`${theme === "dark" ? "text-cyan-400" : "text-cyan-600"} text-center text-lg font-bold tracking-wide`}
                    >
                      Connexion
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={SlideInRight.delay(600)} className="pt-10">
              <View className="flex-row justify-center items-center space-x-2">
                <Text
                  className={`${theme === "dark" ? "text-cyan-300/70" : "text-cyan-600/70"} text-base`}
                >
                  Nouveau ici ?{" "}
                </Text>
                <TouchableOpacity onPress={goToRegister}>
                  <Text
                    className={`${theme === "dark" ? "text-purple-400" : "text-purple-600"} font-bold text-base underline underline-offset-3`}
                  >
                    Créer un compte
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>

          {!keyboardVisible && (
            <Animated.View
              entering={FadeInUp.delay(800)}
              className="mt-16 items-center"
            >
              <Text
                className={`${theme === "dark" ? "text-cyan-400/50" : "text-cyan-600/50"} text-lg tracking-wider`}
              >
                © {new Date().getFullYear()} Tantano - CodeV
              </Text>
              <View className="flex-row space-x-2 mt-3">
                {[...Array(3)].map((_, i) => (
                  <View
                    key={i}
                    className={`w-3 h-3 ${theme === "dark" ? "bg-cyan-500" : "bg-cyan-400"} rounded-full animate-pulse`}
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </View>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
