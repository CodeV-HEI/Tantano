import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
    amount: number;
    paymentDay: number;
}

export const IncomeDisplay = ({ amount, paymentDay }: Props) => {
    const { theme } = useTheme();

    return (
        <View className={`${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-xl p-3 border ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'}`}>
        <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
        <MaterialIcons name="payments" size={20} color={theme === 'dark' ? '#c084fc' : '#9333ea'} />
        <Text className={`ml-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
        Revenu mensuel
        </Text>
        </View>
        <Text className={`font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
        +{amount.toLocaleString('fr-FR')} Ar
        </Text>
        </View>
        <Text className={`text-xs ${theme === 'dark' ? 'text-purple-400/70' : 'text-purple-600/70'} mt-1`}>
        Ajouté le {paymentDay}er de chaque mois
        </Text>
        </View>
    );
};
