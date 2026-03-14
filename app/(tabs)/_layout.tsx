import React, { useEffect } from 'react';
import { useRouter, Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Foundation from '@expo/vector-icons/Foundation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TouchableOpacity, View, StatusBar, Text } from 'react-native';

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

    const titleColor = theme === 'dark' ? '#06b6d4' : '#0891b2';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: titleColor,
                tabBarInactiveTintColor: theme === 'dark' ? '#8b5cf6' : '#7c3aed',
                tabBarStyle: {
                    backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: titleColor,
                },
                headerStyle: {
                    backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
                },
                headerTintColor: theme === 'dark' ? '#ffffff' : '#000000',
                headerRight: () => (
                    <View className="flex-row items-center mr-4">
                        <TouchableOpacity onPress={toggleTheme} className="mr-4">
                            <MaterialIcons
                                name={theme === 'dark' ? 'light-mode' : 'dark-mode'}
                                size={24}
                                color={titleColor}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout}>
                            <MaterialIcons
                                name="logout"
                                size={24}
                                color={titleColor}
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
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="dashboard" size={24} color={titleColor} />
                            <Text style={{
                                color: titleColor,
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginLeft: 8,
                                textShadowColor: titleColor,
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10,
                            }}>
                                TABLEAU DE BORD
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="wallets"
                options={{
                    title: 'PORTEFEUILLES',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="account-balance-wallet" size={size} color={color} />
                    ),
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="account-balance-wallet" size={24} color={titleColor} />
                            <Text style={{
                                color: titleColor,
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginLeft: 8,
                                textShadowColor: titleColor,
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10,
                            }}>
                                PORTEFEUILLES
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'TRANSACTIONS',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="receipt" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="labels"
                options={{
                    title: 'LABELS',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="label" size={size} color={color} />
                    ),
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="label" size={24} color={titleColor} />
                            <Text style={{
                                color: titleColor,
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginLeft: 8,
                                textShadowColor: titleColor,
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10,
                            }}>
                                LABELS
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="projects"
                options={{
                    title: 'PROJETS',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="folder" size={size} color={color} />
                    ),
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="folder" size={24} color={titleColor} />
                            <Text style={{
                                color: titleColor,
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginLeft: 8,
                                textShadowColor: titleColor,
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10,
                            }}>
                                PROJETS
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="goals"
                options={{
                    title: 'OBJECTIFS',
                    tabBarIcon: ({ color, size }) => (
                        <Foundation name="target-two" size={size} color={color} />
                    ),
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="flag" size={24} color={titleColor} />
                            <Text style={{
                                color: titleColor,
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginLeft: 8,
                                textShadowColor: titleColor,
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10,
                            }}>
                                OBJECTIFS
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'PROFIL',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="person" size={24} color={titleColor} />
                            <Text style={{
                                color: titleColor,
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginLeft: 8,
                                textShadowColor: titleColor,
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10,
                            }}>
                                PROFIL
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'PARAMÈTRES',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" size={size} color={color} />
                    ),
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="settings" size={24} color={titleColor} />
                            <Text style={{
                                color: titleColor,
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginLeft: 8,
                                textShadowColor: titleColor,
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10,
                            }}>
                                PARAMÈTRES
                            </Text>
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}