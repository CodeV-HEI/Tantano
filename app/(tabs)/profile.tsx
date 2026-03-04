import SettingItem from '@/components/SettingItem';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StatusBar, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { theme, mode, setMode, toggleTheme } = useTheme();
    const router = useRouter();
    const { enabled, toggle } = useNotification();

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

 return (
        <>
            <ScrollView  className={`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                <View className={`absolute top-10 -left-20 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'} rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />
                <View className={`absolute bottom-40 -right-20 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'} rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />

                <View className="px-4 pt-8">
                    <Animated.View entering={FadeInUp.duration(600)} className="items-center mb-8">
                        <View className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 items-center justify-center mb-4">
                            <MaterialIcons name="person" size={48} color="white" />
                        </View>
                        <Text className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>{user?.username}</Text>
                        <Text className={`${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'} mt-1`}>Membre depuis {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '2026'}</Text>
                    </Animated.View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>PRÉFÉRENCES D&apos;AFFICHAGE</Text>

                        <SettingItem
                            icon="palette"
                            title="Thème"
                            description="Personnalisez l'apparence de l'application"
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
                            description="Utiliser les paramètres de thème du système"
                            rightComponent={
                                <Switch
                                    value={mode === 'system'}
                                    onValueChange={(value) => setMode(value ? 'system' : theme)}
                                    trackColor={{ false: '#d1d5db', true: theme === 'dark' ? '#06b6d4' : '#0891b2' }}
                                    thumbColor="#ffffff"
                                />
                            }
                        />

                        <Pressable onPress={() => router.push('/settings')}>
                            <SettingItem
                                icon="settings"
                                title="Paramètres avancés"
                                description="Configurer les paramétres avancés"
                                    // rightComponent peut être vide ou un chevron si tu veux
                                rightComponent={null} 
                            />
                        </Pressable>
                    </View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>COMPTE ET SÉCURITÉ</Text>

                        <SettingItem
                            icon="security"
                            title="Sécurité"
                            description="Modifier le mot de passe"
                            rightComponent={
                                <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
                            }
                        />

                        <SettingItem
                            icon="notifications"
                            title="Notifications"
                            description="Gérer les notifications"
                            rightComponent={
                                <Switch
                                    value={enabled}          
                                    onValueChange={toggle} 
                                    trackColor={{ false: '#d1d5db', true: theme === 'dark' ? '#06b6d4' : '#0891b2' }}
                                    thumbColor="#ffffff"
                                />
                            }
                        />
                    </View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>AIDE ET SUPPORT</Text>

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