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
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Background3D from '@/components/Background';
import Toast from 'react-native-toast-message';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { forgotPassword } = useAuth();
    const { theme } = useTheme();

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert('Erreur', 'Veuillez entrer votre email');
            return;
        }
        setIsLoading(true);
        try {
            await forgotPassword(email);
            Toast.show({
                type: 'success',
                text1: 'Email envoyé',
                text2: 'Consultez votre boîte de réception',
                position: 'top',
                visibilityTime: 3000,
            });
            router.back();
        } catch (error) {
            console.error('Forgot password error:', error);
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Impossible d\'envoyer l\'email',
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
                            RÉINITIALISATION
                        </Text>
                        <Text className={`${theme === 'dark' ? 'text-cyan-300/70' : 'text-cyan-600/70'} text-center`}>
                            Entrez votre email pour recevoir un lien de réinitialisation
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200)} className="space-y-6">
                        <TextInput
                            className={`${theme === 'dark' ? 'bg-black/60 border-cyan-500/40 text-white' : 'bg-cyan-50/50 border-cyan-300 text-gray-900'} border-2 rounded-xl px-5 py-4 text-lg`}
                            placeholder="votre@email.com"
                            placeholderTextColor={theme === 'dark' ? '#06b6d470' : '#0891b270'}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isLoading}
                            className={`${theme === 'dark' ? 'bg-black border-purple-500/60' : 'bg-white border-purple-400/50'} border-2 rounded-xl py-5 items-center`}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="large" color={theme === 'dark' ? '#a855f7' : '#9333ea'} />
                            ) : (
                                <Text className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} text-lg font-bold`}>
                                    ENVOYER
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.back()} className="py-3">
                            <Text className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} text-center`}>
                                ← Retour
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}