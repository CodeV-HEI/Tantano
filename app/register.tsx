import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react-native';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const router = useRouter();
    const { register } = useAuth();

    React.useEffect(() => {
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
    }, []);

    const handleRegister = async () => {
        if (!username || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);
        try {
            await register(username, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert(
                'Échec de l\'inscription',
                error.response?.data?.message || 'Une erreur est survenue'
            );
            console.log(error);
            
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
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-black"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: keyboardVisible ? 100 : 40
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View className="absolute top-10 -left-20 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl" />
                <View className="absolute bottom-10 -right-20 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl" />

                <View className="px-6 pt-12 pb-10">
                    {!keyboardVisible && (
                        <Animated.View entering={FadeInUp.duration(800)} className="mb-10 items-center">
                            <Text className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 neon-text mb-4">
                                CRÉER UN COMPTE
                            </Text>
                            <Text className="text-cyan-300/80 text-center text-lg tracking-wide">
                                Rejoignez-nous et commencez à gérer vos finances dès aujourd'hui !
                            </Text>
                        </Animated.View>
                    )}

                    <View className="space-y-8">
                        <Animated.View entering={FadeInUp.delay(200)} className="space-y-3">
                            <Text className="text-cyan-300 font-medium tracking-wide text-base">NOM D'UTILISATEUR</Text>
                            <TextInput
                                className="bg-black/60 border-2 border-cyan-500/40 rounded-xl px-5 py-4 text-white text-lg focus:border-cyan-400"
                                placeholder="Choisissez votre nom"
                                placeholderTextColor="#06b6d470"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                returnKeyType="next"
                                blurOnSubmit={false}
                            />
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(400)} className="space-y-3 mt-3">
                            <Text className="text-cyan-300 font-medium tracking-wide text-base">MOT DE PASSE</Text>
                            <View className="relative">
                                <TextInput
                                    className="bg-black/60 border-2 border-cyan-500/40 rounded-xl px-5 py-4 text-white text-lg focus:border-cyan-400 pr-12"
                                    placeholder="Minimum 6 caractères"
                                    placeholderTextColor="#06b6d470"
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
                                        <EyeOff size={24} color="#06b6d4" />
                                    ) : (
                                        <Eye size={24} color="#06b6d4" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(500)} className="space-y-3 mt-3">
                            <Text className="text-purple-300 font-medium tracking-wide text-base">CONFIRMER LE MOT DE PASSE</Text>
                            <View className="relative">
                                <TextInput
                                    className="bg-black/60 border-2 border-purple-500/40 rounded-xl px-5 py-4 text-white text-lg focus:border-purple-400 pr-12"
                                    placeholder="Retapez votre mot de passe"
                                    placeholderTextColor="#a855f770"
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
                                        <EyeOff size={24} color="#a855f7" />
                                    ) : (
                                        <Eye size={24} color="#a855f7" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(600)} className="pt-12">
                            <TouchableOpacity
                                className={`${isPressed ? 'bg-gray-900' : 'bg-black'} border-2 border-purple-500/60 rounded-xl py-5 ${isLoading ? 'opacity-80' : ''} shadow-2xl shadow-purple-500/30 active:scale-[0.98] flex-row justify-center items-center`}
                                onPress={handleRegister}
                                onPressIn={() => setIsPressed(true)}
                                onPressOut={() => setIsPressed(false)}
                                disabled={isLoading}
                                activeOpacity={0.9}
                            >
                                {isLoading ? (
                                    <View className="flex-row justify-center items-center">
                                        <ActivityIndicator size="large" color="#a855f7" />
                                    </View>
                                ) : (
                                    <View className="flex-row justify-center items-center w-full">
                                        <Text className="text-purple-400 text-center text-xl font-bold tracking-widest">
                                            S'INSCRIRE
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(700)} className="pt-12">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="py-3"
                            >
                                <View className="flex-row justify-center items-center space-x-2">
                                    <Text className="text-cyan-400 text-lg font-medium tracking-wide">
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
                                    className="w-2 h-2 bg-cyan-500/60 rounded-full animate-pulse"
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