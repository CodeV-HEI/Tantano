import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface Props {
    searchQuery: string;
    isLoading: boolean;
}

export const EmptyState = ({ searchQuery, isLoading }: Props) => {
    const { theme } = useTheme();

    if (isLoading) return null;

    return (
        <View className="py-10 items-center">
        <View className={`w-20 h-20 rounded-full ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-400/10'}
        items-center justify-center mb-4`}>
        <MaterialIcons
        name="label-off"
        size={32}
        color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
        />
        </View>
        <Text className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg font-semibold mb-2`}>
        {searchQuery ? 'Aucun résultat' : 'Aucun label'}
        </Text>
        <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
        {searchQuery
            ? 'Essayez un autre terme de recherche'
    : 'Cliquez sur le bouton + pour créer votre premier label'}
    </Text>
    </View>
    );
};
