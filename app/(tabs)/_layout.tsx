import React, { useEffect } from 'react';
import { useRouter, Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { TouchableOpacity, View, StatusBar } from 'react-native';

export default function TabLayout() {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme === 'dark' ? '#06b6d4' : '#0891b2',
                tabBarInactiveTintColor: theme === 'dark' ? '#8b5cf6' : '#7c3aed',
                tabBarStyle: {
                    backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: theme === 'dark' ? '#06b6d4' : '#0891b2',
                },
                headerStyle: {
                    backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
                },
                headerTintColor: theme === 'dark' ? '#ffffff' : '#000000',
                headerTitleStyle: {
                    textShadowColor: theme === 'dark' ? '#06b6d4' : '#0891b2',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 10,
                },
                headerRight: () => (
                    <View className="flex-row items-center mr-4">
                        <TouchableOpacity onPress={toggleTheme} className="mr-4">
                            <MaterialIcons
                                name={theme === 'dark' ? 'light-mode' : 'dark-mode'}
                                size={24}
                                color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout}>
                            <MaterialIcons
                                name="logout"
                                size={24}
                                color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
                            />
                        </TouchableOpacity>
                    </View>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'TABLEAU DE BORD',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="dashboard" size={size} color={color} />
                    ),
                    headerTitleStyle: {
                        color: theme === 'dark' ? '#06b6d4' : '#0891b2',
                        textShadowColor: theme === 'dark' ? '#06b6d4' : '#0891b2',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 10,
                    },
                }}
            />
            <Tabs.Screen
                name="wallets"
                options={{
                    title: 'PORTEFEUILLES',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="account-balance-wallet" size={size} color={color} />
                    ),
                    headerTitleStyle: {
                        color: theme === 'dark' ? '#06b6d4' : '#0891b2',
                        textShadowColor: theme === 'dark' ? '#06b6d4' : '#0891b2',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 10,
                    },
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'TRANSACTIONS',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="receipt" size={size} color={color} />
                    ),
                    headerTitleStyle: {
                        color: theme === 'dark' ? '#06b6d4' : '#0891b2',
                        textShadowColor: theme === 'dark' ? '#06b6d4' : '#0891b2',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 10,
                    },
                }}
            />
            <Tabs.Screen
                name="labels"
                options={{
                    title: 'LABELS',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="label" size={size} color={color} />
                    ),
                    headerTitleStyle: {
                        color: theme === 'dark' ? '#06b6d4' : '#0891b2',
                        textShadowColor: theme === 'dark' ? '#06b6d4' : '#0891b2',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 10,
                    },
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'PROFIL',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                    headerTitleStyle: {
                        color: theme === 'dark' ? '#06b6d4' : '#0891b2',
                        textShadowColor: theme === 'dark' ? '#06b6d4' : '#0891b2',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 10,
                    },
                }}
            />
        </Tabs>
    );
}