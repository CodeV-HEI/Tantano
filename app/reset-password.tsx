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
    ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Eye, EyeOff } from 'lucide-react-native';
import Background3D from '@/components/Background';
import Toast from 'react-native-toast-message';

export default function ResetPasswordScreen() {
    const { token } = useLocalSearchParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { resetPassword } = useAuth();
    const { theme } = useTheme();

    const handleReset = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
            return;
        }
        if (!token) {
            Alert.alert('Erreur', 'Token manquant');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, newPassword);
            Toast.show({
                type: 'success',
                text1: 'Mot de passe modifié',
                text2: 'Vous pouvez maintenant vous connecter',
                position: 'top',
                visibilityTime: 3000,
            });
            router.replace('/login');
        } catch (error: any) {
            console.error('Reset password error:', error);
            Toast.show({
                type: 'error',
                text1: 'Échec',
                text2: error.message || 'Le code est invalide ou expiré',
                position: 'top',
                visibilityTime: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <Background3D />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 px-6 pt-20 pb-8 justify-center">
                    <Animated.View entering={FadeInUp.duration(600)} className="items-center mb-12">
                        <Text className={`text-3xl font-bold text-transparent bg-clip-text ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-purple-500' : 'bg-gradient-to-r from-cyan-300 to-purple-300'} mb-4`}>
                            NOUVEAU MOT DE PASSE
                        </Text>
                        <Text className={`${theme === 'dark' ? 'text-cyan-300/70' : 'text-cyan-600/70'} text-center`}>
                            Entrez votre nouveau mot de passe
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200)} className="space-y-6">
                        {/* Nouveau mot de passe */}
                        <View>
                            <Text className={`${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'} font-medium mb-2`}>
                                Nouveau mot de passe
                            </Text>
                            <View className="relative">
                                <TextInput
                                    className={`${theme === 'dark' ? 'bg-black/60 border-cyan-500/40 text-white' : 'bg-cyan-50/50 border-cyan-300 text-gray-900'} border-2 rounded-xl px-5 py-4 text-lg pr-12`}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme === 'dark' ? '#06b6d470' : '#0891b270'}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff size={24} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                                    ) : (
                                        <Eye size={24} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirmation */}
                        <View>
                            <Text className={`${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'} font-medium mb-2`}>
                                Confirmer le mot de passe
                            </Text>
                            <View className="relative">
                                <TextInput
                                    className={`${theme === 'dark' ? 'bg-black/60 border-purple-500/40 text-white' : 'bg-purple-50/50 border-purple-300 text-gray-900'} border-2 rounded-xl px-5 py-4 text-lg pr-12`}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme === 'dark' ? '#a855f770' : '#9333ea70'}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirm}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                >
                                    {showConfirm ? (
                                        <EyeOff size={24} color={theme === 'dark' ? '#a855f7' : '#9333ea'} />
                                    ) : (
                                        <Eye size={24} color={theme === 'dark' ? '#a855f7' : '#9333ea'} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleReset}
                            disabled={isLoading}
                            className={`${theme === 'dark' ? 'bg-black border-purple-500/60' : 'bg-white border-purple-400/50'} border-2 rounded-xl py-5 items-center mt-6`}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="large" color={theme === 'dark' ? '#a855f7' : '#9333ea'} />
                            ) : (
                                <Text className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} text-lg font-bold`}>
                                    RÉINITIALISER
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.replace('/login')} className="py-3">
                            <Text className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} text-center`}>
                                ← Retour à la connexion
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}