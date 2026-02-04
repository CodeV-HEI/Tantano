import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TabLayout() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#06b6d4',
                tabBarInactiveTintColor: '#8b5cf6',
                tabBarStyle: {
                    backgroundColor: '#000000',
                    borderTopWidth: 1,
                    borderTopColor: '#06b6d4',
                },
                headerStyle: {
                    backgroundColor: '#000000',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    textShadowColor: '#06b6d4',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 10,
                },
                headerRight: () => (
                    <TouchableOpacity onPress={handleLogout} className="mr-4">
                        <MaterialIcons
                            name="logout"
                            size={24}
                            color="#06b6d4"
                            style={{
                                textShadowColor: '#06b6d4',
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10,
                            }}
                        />
                    </TouchableOpacity>
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
                        color: '#06b6d4',
                        textShadowColor: '#06b6d4',
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
                        color: '#06b6d4',
                        textShadowColor: '#06b6d4',
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
                        color: '#06b6d4',
                        textShadowColor: '#06b6d4',
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
                        color: '#06b6d4',
                        textShadowColor: '#06b6d4',
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
                        color: '#06b6d4',
                        textShadowColor: '#06b6d4',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 10,
                    },
                }}
            />
        </Tabs>
    );
}