import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { theme, mode, setMode, toggleTheme } = useTheme();
    const router = useRouter();

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
                        await logout();
                        router.replace('/login');
                    }
                }
            ]
        );
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
                <View className="w-10 h-10 rounded-lg bg-cyan-500/10 items-center justify-center mr-3">
                    <MaterialIcons name={icon} size={22} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                </View>
                <View className="flex-1">
                    <Text className="font-semibold text-gray-900 dark:text-white text-base">{title}</Text>
                    {description && (
                        <Text className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{description}</Text>
                    )}
                </View>
            </View>
            {rightComponent}
        </View>
    );

    return (
        <>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
            <ScrollView className="flex-1 bg-white dark:bg-black">
                <View className="absolute top-10 -left-20 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl" />
                <View className="absolute bottom-40 -right-20 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl" />

                <View className="px-4 pt-8">
                    <Animated.View entering={FadeInUp.duration(600)} className="items-center mb-8">
                        <View className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 items-center justify-center mb-4">
                            <MaterialIcons name="person" size={48} color="white" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 dark:text-white">{user?.username}</Text>
                        <Text className="text-cyan-600 dark:text-cyan-300 mt-1">Membre depuis {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'inconnue'}</Text>
                    </Animated.View>

                    <View className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-6">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">PRÉFÉRENCES D&apos;AFFICHAGE</Text>
                        
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
                                    <Text className="ml-2 text-cyan-600 dark:text-cyan-400 font-medium">
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
                                    trackColor={{ false: '#d1d5db', true: '#06b6d4' }}
                                    thumbColor="#ffffff"
                                />
                            }
                        />
                    </View>

                    <View className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-6">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">COMPTE ET SÉCURITÉ</Text>
                        
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
                                    value={true}
                                    onValueChange={() => {}}
                                    trackColor={{ false: '#d1d5db', true: '#06b6d4' }}
                                    thumbColor="#ffffff"
                                />
                            }
                        />
                    </View>

                    <View className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-6">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">AIDE ET SUPPORT</Text>
                        
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
                        <Text className="text-cyan-600/50 dark:text-cyan-400/50 text-center">
                            © {new Date().getFullYear()} Tantano - CodeV
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Version 1.0.0 • Build 1001
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}