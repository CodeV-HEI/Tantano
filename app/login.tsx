import { useAuth } from "@/context/AuthContext";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
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

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

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
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Échec de connexion",
        error.response?.data?.message || "Vérifiez vos identifiants",
      );
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
      className="flex-1 bg-black"
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: keyboardVisible ? 100 : 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-16 pb-8 justify-center">
          <View className="absolute top-20 -left-20 w-60 h-60 bg-purple-500 rounded-full opacity-20 blur-3xl" />
          <View className="absolute bottom-20 -right-20 w-60 h-60 bg-cyan-500 rounded-full opacity-20 blur-3xl" />
          <View className="absolute top-1/3 right-1/4 w-40 h-40 bg-pink-500 rounded-full opacity-10 blur-2xl" />

          {!keyboardVisible && (
            <Animated.View
              entering={FadeInDown.duration(1000).springify()}
              className="items-center mb-12"
            >
              <Text className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 neon-text mb-3">
                Tantano
              </Text>
              <Text className="text-lg text-cyan-300/80 font-light tracking-widest">
                Financial event recording
              </Text>
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInUp.duration(800).delay(200)}
            className="space-y-8"
          >
            <View className="space-y-3">
              <Text className="text-cyan-300 font-medium tracking-wide text-base">
                Nom d'utilisateur
              </Text>
              <TextInput
                className="bg-black/60 border-2 border-cyan-500/40 rounded-xl px-5 py-4 text-white text-lg focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/30"
                placeholder="Entrez votre nom"
                placeholderTextColor="#06b6d470"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>

            <View className="space-y-3 mt-4">
              <Text className="text-cyan-300 font-medium tracking-wide text-base">
                Mot de passe
              </Text>
              <View className="relative">
                <TextInput
                  className="bg-black/60 border-2 border-purple-500/40 rounded-xl px-5 py-4 text-white text-lg focus:border-purple-400 focus:shadow-lg focus:shadow-purple-400/30 pr-12"
                  placeholder="••••••••"
                  placeholderTextColor="#a855f770"
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
                    <EyeOff size={24} color="#a855f7" />
                  ) : (
                    <Eye size={24} color="#a855f7" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View entering={FadeInUp.delay(400)} className="pt-8">
              <TouchableOpacity
                className={`${isPressed ? "bg-gray-900" : "bg-black"} border-2 border-cyan-500/60 rounded-xl py-5 ${isLoading ? "opacity-80" : ""} shadow-2xl shadow-cyan-500/30 active:scale-[0.98] flex-row justify-center items-center`}
                onPress={handleLogin}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                {isLoading ? (
                  <View className="flex-row justify-center items-center">
                    <ActivityIndicator size="large" color="#22d3ee" />
                  </View>
                ) : (
                  <View className="flex-row justify-center items-center w-full">
                    <Text className="text-cyan-400 text-center text-lg font-bold tracking-wide">
                      Connexion
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={SlideInRight.delay(600)} className="pt-10">
              <View className="flex-row justify-center items-center space-x-2">
                <Text className="text-cyan-300/70 text-base">
                  Nouveau ici ?{" "}
                </Text>
                <TouchableOpacity onPress={goToRegister}>
                  <Text className="text-purple-400 font-bold text-base underline underline-offset-3">
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
              <Text className="text-cyan-400/50 text-lg tracking-wider">
                © {new Date().getFullYear()} Posu - RaJharit77
              </Text>
              <View className="flex-row space-x-2 mt-3">
                {[...Array(3)].map((_, i) => (
                  <View
                    key={i}
                    className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </View>
            </Animated.View>
          )}
        </View>
        <Link href="./transactions" className="absolute bottom-10 right-5">
          <Text className="text-cyan-400 underline">Go to Transactions</Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
