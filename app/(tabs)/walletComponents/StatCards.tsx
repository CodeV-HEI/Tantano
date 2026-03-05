import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
    totalBalance: number;
    activeCount: number;
    inactiveCount: number;
}

export const StatCards = ({ totalBalance, activeCount, inactiveCount }: Props) => {
    const { theme } = useTheme();

    return (
        <Animated.View 
            entering={FadeInUp.delay(100)} 
            className="flex-row items-center justify-between mb-4 px-2 py-2 rounded-xl"
            style={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
            }}
        >
            <View className="flex-row items-center">
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                    theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
                }`}>
                    <MaterialIcons name="account-balance" size={16} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                </View>
                <View>
                    <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Solde</Text>
                    <Text className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {totalBalance.toLocaleString('fr-FR')} Ar
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center">
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                    theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
                }`}>
                    <MaterialIcons name="check-circle" size={16} color={theme === 'dark' ? '#4ade80' : '#16a34a'} />
                </View>
                <View>
                    <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Actifs</Text>
                    <Text className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {activeCount}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center">
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                    theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
                }`}>
                    <MaterialIcons name="remove-circle" size={16} color={theme === 'dark' ? '#f87171' : '#dc2626'} />
                </View>
                <View>
                    <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Inactifs</Text>
                    <Text className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {inactiveCount}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};