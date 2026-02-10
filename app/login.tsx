import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    ScrollView,
    Keyboard,
    StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInUp,
    FadeInDown,
    SlideInRight
} from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Eye, EyeOff } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();

    React.useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
        
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [theme]);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        setIsLoading(true);
        try {
            await login(username, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert(
                'Échec de connexion',
                error.response?.data?.message || 'Vérifiez vos identifiants'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const goToRegister = () => {
        router.push('/register');
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white dark:bg-black"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            {/* Bouton de changement de thème */}
            <TouchableOpacity
                onPress={toggleTheme}
                className="absolute top-12 right-6 z-50 p-3 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-cyan-500/20 dark:border-cyan-400/30"
                activeOpacity={0.7}
            >
                <MaterialIcons
                    name={theme === 'dark' ? 'light-mode' : 'dark-mode'}
                    size={24}
                    color={theme === 'dark' ? '#06b6d4' : '#0284c7'}
                />
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={{ 
                    flexGrow: 1,
                    paddingBottom: keyboardVisible ? 100 : 40
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-6 pt-16 pb-8 justify-center">
                    <View className="absolute top-20 -left-20 w-60 h-60 bg-purple-500 rounded-full opacity-10 dark:opacity-20 blur-3xl" />
                    <View className="absolute bottom-20 -right-20 w-60 h-60 bg-cyan-500 rounded-full opacity-10 dark:opacity-20 blur-3xl" />
                    <View className="absolute top-1/3 right-1/4 w-40 h-40 bg-pink-500 rounded-full opacity-5 dark:opacity-10 blur-2xl" />

                    {!keyboardVisible && (
                        <Animated.View
                            entering={FadeInDown.duration(1000).springify()}
                            className="items-center mb-12"
                        >
                            <Text className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 dark:from-cyan-400 dark:via-purple-500 dark:to-pink-500 mb-3">
                                Tantano
                            </Text>
                            <Text className="text-lg text-cyan-700 dark:text-cyan-300/80 font-light tracking-widest">
                                Financial event recording
                            </Text>
                        </Animated.View>
                    )}

                    <Animated.View
                        entering={FadeInUp.duration(800).delay(200)}
                        className="space-y-8"
                    >
                        <View className="space-y-3">
                            <Text className="text-cyan-700 dark:text-cyan-300 font-medium tracking-wide text-base">Nom d&apos;utilisateur</Text>
                            <TextInput
                                className="bg-gray-50 dark:bg-black/60 border-2 border-cyan-500/30 dark:border-cyan-500/40 rounded-xl px-5 py-4 text-gray-900 dark:text-white text-lg focus:border-cyan-500 dark:focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 dark:focus:shadow-cyan-400/30"
                                placeholder="Entrez votre nom"
                                placeholderTextColor={theme === 'dark' ? '#06b6d470' : '#0284c770'}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                returnKeyType="next"
                                blurOnSubmit={false}
                            />
                        </View>

                        <View className="space-y-3 mt-4">
                            <Text className="text-cyan-700 dark:text-cyan-300 font-medium tracking-wide text-base">Mot de passe</Text>
                            <View className="relative">
                                <TextInput
                                    className="bg-gray-50 dark:bg-black/60 border-2 border-purple-500/30 dark:border-purple-500/40 rounded-xl px-5 py-4 text-gray-900 dark:text-white text-lg focus:border-purple-500 dark:focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 dark:focus:shadow-purple-400/30 pr-12"
                                    placeholder="••••••••"
                                    placeholderTextColor={theme === 'dark' ? '#a855f770' : '#7c3aed70'}
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
                                        <EyeOff size={24} color={theme === 'dark' ? '#a855f7' : '#7c3aed'} />
                                    ) : (
                                        <Eye size={24} color={theme === 'dark' ? '#a855f7' : '#7c3aed'} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Animated.View entering={FadeInUp.delay(400)} className="pt-8">
                            <TouchableOpacity
                                className={`${isPressed ? 'bg-gray-100 dark:bg-gray-900' : 'bg-white dark:bg-black'} border-2 border-cyan-500/40 dark:border-cyan-500/60 rounded-xl py-5 ${isLoading ? 'opacity-80' : ''} shadow-xl shadow-cyan-500/10 dark:shadow-cyan-500/30 active:scale-[0.98] flex-row justify-center items-center`}
                                onPress={handleLogin}
                                onPressIn={() => setIsPressed(true)}
                                onPressOut={() => setIsPressed(false)}
                                disabled={isLoading}
                                activeOpacity={0.9}
                            >
                                {isLoading ? (
                                    <View className="flex-row justify-center items-center">
                                        <ActivityIndicator size="large" color="#0284c7 dark:#22d3ee" />
                                    </View>
                                ) : (
                                    <View className="flex-row justify-center items-center w-full">
                                        <Text className="text-cyan-700 dark:text-cyan-400 text-center text-lg font-bold tracking-wide">
                                            Connexion
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View
                            entering={SlideInRight.delay(600)}
                            className="pt-10"
                        >
                            <View className="flex-row justify-center items-center space-x-2">
                                <Text className="text-cyan-700/70 dark:text-cyan-300/70 text-base">Nouveau ici ? </Text>
                                <TouchableOpacity onPress={goToRegister}>
                                    <Text className="text-purple-700 dark:text-purple-400 font-bold text-base underline underline-offset-3">
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
                            <Text className="text-cyan-700/50 dark:text-cyan-400/50 text-lg tracking-wider">
                                © {new Date().getFullYear()} Tantano - CodeV
                            </Text>
                            <View className="flex-row space-x-2 mt-3">
                                {[...Array(3)].map((_, i) => (
                                    <View
                                        key={i}
                                        className="w-3 h-3 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse"
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