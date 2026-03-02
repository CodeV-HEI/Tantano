import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    TextInput,
    StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSettings, NotificationRecurrence, Currency } from '@/hooks/useSettings';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import * as LocalAuthentication from 'expo-local-authentication';

export default function ProfileScreen() {
    const { user, logout, biometricsAvailable } = useAuth();
    const { theme, mode, setMode, toggleTheme } = useTheme();
    const { settings, updateSettings } = useSettings();
    const router = useRouter();

    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    const handleLogout = async () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                            Toast.show({
                                type: 'success',
                                text1: 'Déconnexion réussie',
                                text2: 'À bientôt !',
                                position: 'top',
                                visibilityTime: 2000,
                            });
                            router.replace('/login');
                        } catch (error) {
                            console.error('Logout failed:', error);
                            Toast.show({
                                type: 'error',
                                text1: 'Erreur',
                                text2: 'Impossible de se déconnecter',
                                position: 'top',
                                visibilityTime: 3000,
                            });
                        }
                    }
                }
            ]
        );
    };

    const handlePremiumToggle = () => {
        updateSettings({ isPremium: !settings.isPremium });
        Toast.show({
            type: 'success',
            text1: settings.isPremium ? 'Abonnement annulé' : 'Abonnement premium activé',
            text2: settings.isPremium ? 'Retour à la version gratuite' : 'Merci pour votre confiance !',
            position: 'top',
            visibilityTime: 2000,
        });
    };

    const handleBiometricToggle = async (value: boolean) => {
        if (value) {
            try {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: 'Authentifiez-vous pour activer la connexion biométrique',
                    cancelLabel: 'Annuler',
                    disableDeviceFallback: false,
                });
                if (result.success) {
                    updateSettings({ biometricsEnabled: true });
                    Toast.show({
                        type: 'success',
                        text1: 'Connexion biométrique activée',
                        text2: 'Vous pouvez maintenant vous connecter avec votre empreinte',
                        position: 'top',
                        visibilityTime: 2000,
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Activation annulée',
                        text2: 'Authentification biométrique échouée',
                        position: 'top',
                        visibilityTime: 2000,
                    });
                }
            } catch (error) {
                console.error('Biometric auth error', error);
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Impossible d\'utiliser la biométrie',
                    position: 'top',
                    visibilityTime: 2000,
                });
            }
        } else {
            updateSettings({ biometricsEnabled: false });
            Toast.show({
                type: 'info',
                text1: 'Connexion biométrique désactivée',
                position: 'top',
                visibilityTime: 2000,
            });
        }
    };

    const SettingItem = ({
        icon,
        title,
        description,
        rightComponent
    }: {
        icon: keyof typeof MaterialIcons.glyphMap;
        title: string;
        description?: string;
        rightComponent?: React.ReactNode;
    }) => (
        <View className="flex-row items-center justify-between py-4 px-2 border-b border-gray-200 dark:border-gray-800">
            <View className="flex-row items-center flex-1">
                <View className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-400/10'} items-center justify-center mr-3`}>
                    <MaterialIcons name={icon} size={22} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                </View>
                <View className="flex-1">
                    <Text className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base`}>{title}</Text>
                    {description && (
                        <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm mt-0.5`}>{description}</Text>
                    )}
                </View>
            </View>
            {rightComponent}
        </View>
    );

    const RecurrenceSelector = () => {
        const options: { value: NotificationRecurrence; label: string }[] = [
            { value: 'daily', label: 'Quotidien' },
            { value: 'weekly', label: 'Hebdomadaire' },
            { value: 'monthly', label: 'Mensuel' },
        ];
        return (
            <View className="flex-row justify-around mt-2">
                {options.map((opt) => (
                    <TouchableOpacity
                        key={opt.value}
                        onPress={() => updateSettings({ notificationRecurrence: opt.value })}
                        className={`px-4 py-2 rounded-full ${settings.notificationRecurrence === opt.value
                            ? 'bg-cyan-500'
                            : theme === 'dark'
                                ? 'bg-gray-800'
                                : 'bg-gray-200'
                            }`}
                    >
                        <Text
                            className={
                                settings.notificationRecurrence === opt.value
                                    ? 'text-white font-medium'
                                    : theme === 'dark'
                                        ? 'text-gray-300'
                                        : 'text-gray-700'
                            }
                        >
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const CurrencySelector = () => {
        const currencies: Currency[] = ['USD', 'MGA', 'EUR'];
        return (
            <View className="flex-row justify-around mt-2">
                {currencies.map((cur) => (
                    <TouchableOpacity
                        key={cur}
                        onPress={() => updateSettings({ currency: cur })}
                        className={`px-4 py-2 rounded-full ${settings.currency === cur
                            ? 'bg-purple-500'
                            : theme === 'dark'
                                ? 'bg-gray-800'
                                : 'bg-gray-200'
                            }`}
                    >
                        <Text
                            className={
                                settings.currency === cur
                                    ? 'text-white font-medium'
                                    : theme === 'dark'
                                        ? 'text-gray-300'
                                        : 'text-gray-700'
                            }
                        >
                            {cur}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <>
            <ScrollView className="flex-1 bg-white dark:bg-black">
                <View className={`absolute top-10 -left-20 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'} rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />
                <View className={`absolute bottom-40 -right-20 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'} rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />

                <View className="px-4 pt-8">
                    <Animated.View entering={FadeInUp.duration(600)} className="items-center mb-8">
                        <View className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 items-center justify-center mb-4">
                            <MaterialIcons name="person" size={48} color="white" />
                        </View>
                        <Text className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>{user?.username}</Text>
                        <Text className={`${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'} mt-1`}>
                            Membre depuis {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '2026'}
                        </Text>
                    </Animated.View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>
                            NOTIFICATIONS
                        </Text>

                        <SettingItem
                            icon="notifications-active"
                            title="Récurrence"
                            description="Fréquence des notifications"
                            rightComponent={null}
                        />
                        <RecurrenceSelector />

                        <View className="mt-4">
                            <Text className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                                Nombre de jours pour le calcul
                            </Text>
                            <View className="flex-row items-center">
                                <TextInput
                                    className={`border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg px-4 py-2 w-20 text-center`}
                                    value={String(settings.notificationDays)}
                                    onChangeText={(text) => {
                                        const days = parseInt(text) || 1;
                                        updateSettings({ notificationDays: Math.max(1, days) });
                                    }}
                                    keyboardType="numeric"
                                    maxLength={2}
                                />
                                <Text className={`ml-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>jours</Text>
                            </View>
                        </View>
                    </View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>
                            ABONNEMENT
                        </Text>

                        <SettingItem
                            icon="star"
                            title="Statut actuel"
                            description={settings.isPremium ? 'Premium' : 'Gratuit'}
                            rightComponent={
                                <View className={`px-3 py-1 rounded-full ${settings.isPremium ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                                    <Text className="text-white text-xs font-bold">
                                        {settings.isPremium ? 'PREMIUM' : 'GRATUIT'}
                                    </Text>
                                </View>
                            }
                        />

                        <TouchableOpacity
                            onPress={handlePremiumToggle}
                            className={`mt-4 py-3 rounded-xl ${settings.isPremium ? 'bg-red-500/20 border-2 border-red-500/30' : 'bg-gradient-to-r from-cyan-500 to-purple-500'}`}
                        >
                            <Text className={`text-center font-bold ${settings.isPremium ? 'text-red-600 dark:text-red-400' : 'text-white'}`}>
                                {settings.isPremium ? 'SE DÉSABONNER' : 'PASSER À PREMIUM'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>
                            PRÉFÉRENCES
                        </Text>

                        <SettingItem
                            icon="attach-money"
                            title="Devise"
                            description="Monnaie utilisée dans l'application"
                            rightComponent={null}
                        />
                        <CurrencySelector />

                        <SettingItem
                            icon="fingerprint"
                            title="Login sans mot de passe"
                            description="Utiliser Face ID / empreinte"
                            rightComponent={
                                <Switch
                                    value={settings.biometricsEnabled}
                                    onValueChange={handleBiometricToggle}
                                    disabled={!biometricsAvailable}
                                    trackColor={{ false: '#d1d5db', true: theme === 'dark' ? '#06b6d4' : '#0891b2' }}
                                    thumbColor="#ffffff"
                                />
                            }
                        />
                        {!biometricsAvailable && (
                            <Text className={`text-xs ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} mt-1`}>
                                Biométrie non disponible sur cet appareil
                            </Text>
                        )}
                    </View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>
                            AFFICHAGE
                        </Text>

                        <SettingItem
                            icon="palette"
                            title="Thème"
                            description="Personnalisez l'apparence"
                            rightComponent={
                                <TouchableOpacity onPress={toggleTheme} className="flex-row items-center">
                                    <MaterialIcons
                                        name={theme === 'dark' ? 'dark-mode' : 'light-mode'}
                                        size={24}
                                        color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
                                    />
                                    <Text className={`ml-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} font-medium`}>
                                        {theme === 'dark' ? 'Sombre' : 'Clair'}
                                    </Text>
                                </TouchableOpacity>
                            }
                        />

                        <SettingItem
                            icon="brightness-auto"
                            title="Suivre le système"
                            description="Utiliser les paramètres du système"
                            rightComponent={
                                <Switch
                                    value={mode === 'system'}
                                    onValueChange={(value) => setMode(value ? 'system' : theme)}
                                    trackColor={{ false: '#d1d5db', true: theme === 'dark' ? '#06b6d4' : '#0891b2' }}
                                    thumbColor="#ffffff"
                                />
                            }
                        />
                    </View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>
                            COMPTE ET SÉCURITÉ
                        </Text>

                        <SettingItem
                            icon="security"
                            title="Sécurité"
                            description="Modifier le mot de passe"
                            rightComponent={
                                <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
                            }
                        />
                    </View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>
                            AIDE ET SUPPORT
                        </Text>

                        <SettingItem
                            icon="help"
                            title="Centre d'aide"
                            description="FAQ et support"
                            rightComponent={
                                <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
                            }
                        />

                        <SettingItem
                            icon="info"
                            title="À propos"
                            description="Version 1.0.0"
                            rightComponent={
                                <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
                            }
                        />

                        <SettingItem
                            icon="star"
                            title="Évaluer l'application"
                            description="Donnez votre avis"
                            rightComponent={
                                <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
                            }
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-red-500/10 border-2 border-red-500/30 rounded-xl py-4 flex-row justify-center items-center mb-8"
                    >
                        <MaterialIcons name="logout" size={20} color="#ef4444" />
                        <Text className="text-red-600 dark:text-red-400 font-bold text-lg ml-2">
                            DÉCONNEXION
                        </Text>
                    </TouchableOpacity>

                    <View className="items-center mb-8">
                        <Text className={`${theme === 'dark' ? 'text-cyan-400/50' : 'text-cyan-500'} text-center`}>
                            © {new Date().getFullYear()} Tantano - CodeV
                        </Text>
                        <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1`}>
                            Version 1.0.0 • Build 1001
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}