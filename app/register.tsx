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
    View
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Eye, EyeOff } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Background3D from '@/components/Background';
import Toast from 'react-native-toast-message';
import GoogleButton from "@/components/GoogleButton";

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const router = useRouter();
    const { register } = useAuth();
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

    const handleRegister = async () => {
        if (!username || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
            return;
        }

        setIsLoading(true);
        try {
            await register(username, password);
            Toast.show({
                type: "success",
                text1: "Inscription réussie",
                text2: "Vous êtes maintenant connecté",
                position: "top",
                visibilityTime: 2000,
            });
            router.replace("/(tabs)");
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Une erreur est survenue";
            Toast.show({
                type: "error",
                text1: "Échec de l'inscription",
                text2: message,
                position: "top",
                visibilityTime: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >

            <Background3D />

            <TouchableOpacity
                onPress={toggleTheme}
                className={`absolute top-12 right-6 z-50 p-3 rounded-full ${theme === "dark" ? "bg-black/10 backdrop-blur-sm border border-purple-500/20" : "bg-purple-50/80 backdrop-blur-sm border border-purple-200"}`}
                activeOpacity={0.7}
            >
                <MaterialIcons
                    name={theme === "dark" ? "light-mode" : "dark-mode"}
                    size={24}
                    color={theme === "dark" ? "#a855f7" : "#9333ea"}
                />
            </TouchableOpacity>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: keyboardVisible ? 100 : 40,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View className="px-6 pt-12 pb-10">
                    {!keyboardVisible && (
                        <Animated.View
                            entering={FadeInUp.duration(800)}
                            className="mb-10 items-center"
                        >
                            <Text
                                className={`text-5xl font-bold text-transparent bg-clip-text ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" : "bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300"} ${theme === "dark" ? "neon-text" : "neon-text-light"} mb-4`}
                            >
                                CRÉER UN COMPTE
                            </Text>
                            <Text
                                className={`${theme === "dark" ? "text-cyan-300/80" : "text-cyan-600/80"} text-center text-lg tracking-wide`}
                            >
                                Rejoignez-nous et commencez à gérer vos finances dès
                                aujourd&apos;hui !
                            </Text>
                        </Animated.View>
                    )}

                    <View className="space-y-8">
                        <Animated.View entering={FadeInUp.delay(200)} className="space-y-3">
                            <Text
                                className={`${theme === "dark" ? "text-cyan-300" : "text-cyan-600"} font-medium tracking-wide text-base`}
                            >
                                NOM D&apos;UTILISATEUR
                            </Text>
                            <TextInput
                                className={`${theme === "dark" ? "bg-black/60 border-cyan-500/40 text-white" : "bg-cyan-50/50 border-cyan-300 text-gray-900"} border-2 rounded-xl px-5 py-4 text-lg focus:border-cyan-400`}
                                placeholder="Choisissez votre nom"
                                placeholderTextColor={
                                    theme === "dark" ? "#06b6d470" : "#0891b270"
                                }
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                returnKeyType="next"
                                blurOnSubmit={false}
                            />
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(300)} className="space-y-3">
                            <Text className={`${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'} font-medium tracking-wide text-base`}>EMAIL</Text>
                            <TextInput
                                className={`${theme === 'dark' ? 'bg-black/60 border-cyan-500/40 text-white' : 'bg-cyan-50/50 border-cyan-300 text-gray-900'} border-2 rounded-xl px-5 py-4 text-lg focus:border-cyan-400`}
                                placeholder="jack.sparrow@gmail.com"
                                placeholderTextColor={theme === 'dark' ? '#06b6d470' : '#0891b270'}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                            />
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(400)}
                            className="space-y-3 mt-3"
                        >
                            <Text
                                className={`${theme === "dark" ? "text-cyan-300" : "text-cyan-600"} font-medium tracking-wide text-base`}
                            >
                                MOT DE PASSE
                            </Text>
                            <View className="relative">
                                <TextInput
                                    className={`${theme === "dark" ? "bg-black/60 border-cyan-500/40 text-white" : "bg-cyan-50/50 border-cyan-300 text-gray-900"} border-2 rounded-xl px-5 py-4 text-lg focus:border-cyan-400 pr-12`}
                                    placeholder="Minimum 6 caractères"
                                    placeholderTextColor={
                                        theme === "dark" ? "#06b6d470" : "#0891b270"
                                    }
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                                <TouchableOpacity
                                    onPress={toggleShowPassword}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    activeOpacity={0.7}
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={24}
                                            color={theme === "dark" ? "#06b6d4" : "#0891b2"}
                                        />
                                    ) : (
                                        <Eye
                                            size={24}
                                            color={theme === "dark" ? "#06b6d4" : "#0891b2"}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(500)}
                            className="space-y-3 mt-3"
                        >
                            <Text
                                className={`${theme === "dark" ? "text-purple-300" : "text-purple-600"} font-medium tracking-wide text-base`}
                            >
                                CONFIRMER LE MOT DE PASSE
                            </Text>
                            <View className="relative">
                                <TextInput
                                    className={`${theme === "dark" ? "bg-black/60 border-purple-500/40 text-white" : "bg-purple-50/50 border-purple-300 text-gray-900"} border-2 rounded-xl px-5 py-4 text-lg focus:border-purple-400 pr-12`}
                                    placeholder="Retapez votre mot de passe"
                                    placeholderTextColor={
                                        theme === "dark" ? "#a855f770" : "#9333ea70"
                                    }
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    returnKeyType="done"
                                    onSubmitEditing={handleRegister}
                                />
                                <TouchableOpacity
                                    onPress={toggleShowConfirmPassword}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    activeOpacity={0.7}
                                >
                                    {showConfirmPassword ? (
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
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(600)} className="pt-12">
                            <TouchableOpacity
                                className={`${isPressed ? (theme === "dark" ? "bg-gray-900" : "bg-gray-100") : theme === "dark" ? "bg-black" : "bg-white"} ${theme === "dark" ? "border-purple-500/60 shadow-purple-500/30" : "border-purple-400/50 shadow-purple-400/20"} border-2 rounded-xl py-5 ${isLoading ? "opacity-80" : ""} shadow-2xl active:scale-[0.98] flex-row justify-center items-center`}
                                onPress={handleRegister}
                                onPressIn={() => setIsPressed(true)}
                                onPressOut={() => setIsPressed(false)}
                                disabled={isLoading}
                                activeOpacity={0.9}
                            >
                                {isLoading ? (
                                    <View className="flex-row justify-center items-center">
                                        <ActivityIndicator
                                            size="large"
                                            color={theme === "dark" ? "#a855f7" : "#9333ea"}
                                        />
                                    </View>
                                ) : (
                                    <View className="flex-row justify-center items-center w-full">
                                        <Text
                                            className={`${theme === "dark" ? "text-purple-400" : "text-purple-600"} text-center text-xl font-bold tracking-widest`}
                                        >
                                            S&apos;INSCRIRE
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>

                        <GoogleButton mode="register" />

                        <Animated.View entering={FadeInUp.delay(700)} className="pt-12">
                            <TouchableOpacity onPress={() => router.back()} className="py-3">
                                <View className="flex-row justify-center items-center space-x-2">
                                    <Text
                                        className={`${theme === "dark" ? "text-cyan-400" : "text-cyan-600"} text-lg font-medium tracking-wide`}
                                    >
                                        ← Retour à la connexion
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {!keyboardVisible && (
                        <View className="flex-row justify-center space-x-3 mt-16">
                            {[...Array(5)].map((_, i) => (
                                <View
                                    key={i}
                                    className={`w-2 h-2 ${theme === "dark" ? "bg-cyan-500/60" : "bg-cyan-400/40"} rounded-full animate-pulse`}
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
