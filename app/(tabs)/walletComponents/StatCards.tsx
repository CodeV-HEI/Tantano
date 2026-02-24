import React, { useEffect } from 'react';
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


    useEffect(() => {
        console.log('📊 StatCards reçoit:', { totalBalance, activeCount, inactiveCount });
    }, [totalBalance, activeCount, inactiveCount]);

    const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: keyof typeof MaterialIcons.glyphMap; color: string }) => (
        <View className={`flex-1 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mx-1`}>
        <View className="flex-row items-center mb-2">
        <MaterialIcons name={icon} size={20} color={color} />
        <Text className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</Text>
        </View>
        <Text className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</Text>
        </View>
    );

    return (
        <Animated.View entering={FadeInUp.delay(100)} className="flex-row mb-6">
        <StatCard
        title="SOLDE TOTAL"
        value={`${totalBalance.toLocaleString('fr-FR')} Ar`}
        icon="account-balance"
        color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
        />
        <StatCard
        title="ACTIFS"
        value={`${activeCount}`}
        icon="check-circle"
        color={theme === 'dark' ? '#4ade80' : '#16a34a'}
        />
        <StatCard
        title="INACTIFS"
        value={`${inactiveCount}`}
        icon="remove-circle"
        color={theme === 'dark' ? '#f87171' : '#dc2626'}
        />
        </Animated.View>
    );
};
